import { AABB } from '../../../engine/math/aabb';
import { div } from '../../../engine/math/math-base';
import { Vector2 } from '../../../engine/math/vector2';
import { renderer } from '../../../engine/render/webgl';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { PlayerType } from './game-state';
import { Player } from './player';

export class PlayerRenderableHelper {
  static build(player: Player): void {
    const ship = player.ship.renderable;
    ship.sprite = new Sprite(280, 660, new Vector2(0, 0));

    switch (player.playerData.playerType) {
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
    return result;
  }

  static getTextsToRender(player: Player): Text[] {
    return [player.ship.renderable.healthText];
  }
}
