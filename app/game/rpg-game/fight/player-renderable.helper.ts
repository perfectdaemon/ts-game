import { AABB } from '../../../engine/math/aabb';
import { div } from '../../../engine/math/math-base';
import { renderer } from '../../../engine/render/webgl';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { PlayerType } from './game-state';
import { Player } from './player';

export class PlayerRenderableHelper {
  static build(player: Player): void {
    const ship = player.ship.renderable;
    ship.sprite = new Sprite(280, 660);

    switch (player.playerData.playerType) {
      case PlayerType.Human:
        ship.sprite.pivotPoint.set(0, 0);
        ship.sprite.position.set(10, 10, 1);
        ship.sprite.setVerticesColor(0.8, 0.9, 0.8, 1.0);
        break;
      case PlayerType.Ai:
        ship.sprite.pivotPoint.set(0, 0);
        ship.sprite.position.set(renderer.width - 10 - ship.sprite.width, 10, 1);
        ship.sprite.setVerticesColor(0.9, 0.8, 0.8, 1.0);
        break;
    }

    ship.sprite.setDefaultVertices();

    player.ship.cells.forEach((cell, i) => {
      const row = div(i, 3);
      const col = i % 3;
      const renderable = cell.renderable;

      renderable.sprite = new Sprite(50, 50);
      renderable.sprite.position.set(35 + 60 * col, 35 + 60 * row, 2);
      renderable.sprite.setVerticesColor(1, 1, 1, 1.0);
      renderable.sprite.parent = ship.sprite;

      renderable.mark = new Sprite(15, 15);
      renderable.mark.position.set(0, 5, 3);
      renderable.mark.parent = renderable.sprite;
      renderable.mark.visible = false;

      renderable.healthText = new Text(cell.health.toString());
      renderable.healthText.pivotPoint.set(0.5, 0.5);
      renderable.healthText.position.set(0, -15, 3);
      renderable.healthText.color.set(0, 0, 0, 1.0);
      renderable.healthText.parent = renderable.sprite;

      renderable.hitBox = new AABB(renderable.sprite.absoluteMatrix.position.asVector2(), renderable.sprite.size);
    });
  }

  static getSpritesToRender(player: Player): Sprite[] {
    return [player.ship.renderable.sprite]
      .concat(player.ship.cells.map(c => c.renderable.sprite))
      .concat(player.ship.cells.map(c => c.renderable.mark));
  }

  static getTextsToRender(player: Player): Text[] {
    return player.ship.cells.map(c => c.renderable.healthText);
  }
}
