import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { DialogBox } from '../dialog-box';
import { PlayerData } from '../player-data';
import { IRenderable } from '../render-helper';

export class Player implements IRenderable {

  static build(playerData: PlayerData): Player {
    const player = new Player();

    player.playerData = playerData;

    player.statsBox = new DialogBox();
    const background = player.statsBox.background;
    background.pivotPoint.set(0, 0);
    background.setSize(350, 400);
    background.position.set(10, 10, 1);
    background.setDefaultVertices();

    const text = player.statsBox.text;
    text.pivotPoint.set(0, 0);
    text.position.set(5, 5, 2);
    text.isWrapped = false;

    player.updateText();
    return player;
  }

  statsBox: DialogBox;

  playerData: PlayerData;

  updateText(): void {
    this.statsBox.text.text =
      `Корабль игрока
Здоровье: ${this.playerData.shipHealth} / ${this.playerData.shipMaxHealth}
Отсеки корабля: ${this.playerData.cellCount}
Урон: ${this.playerData.attackDamageMin}-${this.playerData.attackDamageMax}
Крит: ${this.playerData.criticalChance * 100}%
Сила щита: ${this.playerData.protectMultiplier * 100}%
Число орудий: ${this.playerData.attackCount}
Число генераторов щита: ${this.playerData.protectCount}`;
  }

  getSpritesToRender(): Sprite[] {
    return this.statsBox.getSpritesToRender();
  }

  getTextsToRender(): Text[] {
    return this.statsBox.getTextsToRender();
  }
}
