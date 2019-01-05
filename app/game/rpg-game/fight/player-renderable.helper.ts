import { AABB } from '../../../engine/math/aabb';
import { div } from '../../../engine/math/math-base';
import { Vector2 } from '../../../engine/math/vector2';
import { renderer } from '../../../engine/render/webgl';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { AttackCountItem } from './attack-count-item';
import { CriticalChanceItem } from './critical-chance-item';
import { HealItem } from './heal-item';
import { Player } from './player';
import { PlayerType } from './player-type';
import { ProtectCountItem } from './protect-count-item';

export class PlayerRenderableHelper {
  static build(player: Player): void {
    const ship = player.ship.renderable;
    ship.sprite = new Sprite(280, 660, new Vector2(0, 0));

    switch (player.type) {
      case PlayerType.Human:
        ship.sprite.position.set(10, 10, 1);
        ship.sprite.setVerticesColor(0.8, 0.9, 0.8, 1.0);
        break;
      case PlayerType.Ai:
        ship.sprite.position.set(renderer.width - 10 - ship.sprite.width, 10, 1);
        ship.sprite.setVerticesColor(0.9, 0.8, 0.8, 1.0);
        break;
    }

    ship.healthText = new Text(player.ship.health.toString());
    ship.healthText.pivotPoint.set(0.5, 0.5);
    ship.healthText.position.set(ship.sprite.width / 2, 15, 3);
    ship.healthText.color.set(0, 0, 0, 1.0);
    ship.healthText.parent = ship.sprite;

    player.ship.cells.forEach((cell, i) => {
      const row = div(i, 3);
      const col = i % 3;
      const renderable = cell.renderable;

      renderable.sprite = new Sprite(50, 50);
      renderable.sprite.position.set(35 + 60 * col, 85 + 60 * row, 2);
      renderable.sprite.setVerticesColor(1, 1, 1, 1.0);
      renderable.sprite.parent = ship.sprite;

      renderable.protectMark = new Sprite(70, 70);
      renderable.protectMark.position.set(-0, 0, 3);
      renderable.protectMark.parent = renderable.sprite;
      renderable.protectMark.visible = false;
      renderable.protectMark.setVerticesColor(0.3, 0.3, 1.0, 0.3);

      renderable.attackMark = new Sprite(15, 15);
      renderable.attackMark.position.set(0, 0, 3);
      renderable.attackMark.parent = renderable.sprite;
      renderable.attackMark.visible = false;
      renderable.attackMark.setVerticesColor(1.0, 0.3, 0.3, 1.0);

      renderable.hitBox = new AABB(renderable.sprite.absoluteMatrix.position.asVector2(), renderable.sprite.size);
    });

    player.items.forEach((item, i) => {
      const renderable = item.renderable;
      renderable.background = new Sprite(70, 70);
      renderable.background.position.set(45 + 80 * i, ship.sprite.height - 45, 2);
      renderable.background.setVerticesColor(1, 1, 1, 1.0);
      renderable.background.parent = ship.sprite;

      renderable.countText = new Text();
      renderable.countText.pivotPoint.set(1, 1);
      renderable.countText.position.set(renderable.background.width / 2 - 5, renderable.background.height / 2 - 5, 4);
      renderable.countText.color.set(1, 1, 1, 1.0);
      renderable.countText.shadowEnabled = true;
      renderable.countText.shadowColor.set(0, 0, 0, 1.0);
      renderable.countText.shadowOffset.set(1, 2);
      renderable.countText.parent = renderable.background;

      renderable.updateCountText(item.count);

      renderable.effectText = new Text();
      renderable.effectText.pivotPoint.set(0.5, 0.5);
      renderable.effectText.position.set(0, -12, 3);
      renderable.effectText.color.set(1, 1, 1, 1.0);
      renderable.effectText.shadowEnabled = true;
      renderable.effectText.shadowColor.set(0, 0, 0, 1.0);
      renderable.effectText.shadowOffset.set(1, 2);
      renderable.effectText.parent = renderable.background;

      renderable.hitBox = new AABB(
        renderable.background.absoluteMatrix.position.asVector2(),
        renderable.background.size,
      );

      if (item instanceof HealItem) {
        renderable.background.setVerticesColor(0.1, 0.7, 0.1, 1.0);
        renderable.effectText.text = '+З';
      } else if (item instanceof AttackCountItem) {
        renderable.background.setVerticesColor(0.7, 0.1, 0.1, 1.0);
        renderable.effectText.text = '+А';
      } else if (item instanceof CriticalChanceItem) {
        renderable.background.setVerticesColor(0.7, 0.7, 0.1, 1.0);
        renderable.effectText.text = '+К';
      } else if (item instanceof ProtectCountItem) {
        renderable.background.setVerticesColor(0.1, 0.1, 0.7, 1.0);
        renderable.effectText.text = '+Щ';
      }

    });
  }

  static getSpritesToRender(player: Player): Sprite[] {
    const result: Sprite[] = [];

    result.push(player.ship.renderable.sprite);
    for (const cell of player.ship.cells) {
      result.push(
        cell.renderable.sprite,
        cell.renderable.attackMark,
        cell.renderable.protectMark,
      );
    }

    for (const item of player.items) {
      result.push(item.renderable.background);
    }
    return result;
  }

  static getTextsToRender(player: Player): Text[] {
    const result: Text[] = [];
    result.push(player.ship.renderable.healthText);
    for (const item of player.items) {
      result.push(
        item.renderable.countText,
        item.renderable.effectText,
      );
    }
    return result;
  }
}
