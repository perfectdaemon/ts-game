import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { Player } from './player';

export class PlayerRenderableHelper {
  static build(player: Player): void {
    const ship = player.ship.renderable;
    ship.sprite = new Sprite();

    player.ship.cells.map(c => c.renderable).forEach(cell => {
      cell.healthText = new Text();
      cell.mark = new Sprite();
      cell.sprite = new Sprite();
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
