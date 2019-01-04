import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { IRenderable } from '../render-helper';
import { PlayerData } from './game-state';
import { PlayerRenderableHelper } from './player-renderable.helper';
import { Ship } from './ship';
import { ShipCell } from './ship-cell';

export class Player implements IRenderable {

  static build(playerData: PlayerData): Player {
    const player = new Player();
    player.ship.health = playerData.shipHealth;
    for (let i = 0; i < playerData.cellCount; ++i) {
      const cell = new ShipCell();
      player.ship.cells.push(cell);
    }

    player.playerData = playerData;
    PlayerRenderableHelper.build(player);

    player.resetTurnState();

    return player;
  }

  playerData: PlayerData;

  attacksLeft: number;
  protectsLeft: number;

  ship: Ship = new Ship();

  getSpritesToRender(): Sprite[] {
    return PlayerRenderableHelper.getSpritesToRender(this);
  }

  getTextsToRender(): Text[] {
    return PlayerRenderableHelper.getTextsToRender(this);
  }

  resetTurnState(): void {
    for (const cell of this.ship.cells) {
      cell.reset();
    }

    this.attacksLeft = this.playerData.attackCount;
    this.protectsLeft = this.playerData.protectCount;
  }

  hasProtectsLeft(): boolean {
    return this.protectsLeft > 0;
  }

  hasAttacksLeft(): boolean {
    return this.attacksLeft > 0;
  }

  isOwnCell(cell: ShipCell): boolean {
    return this.ship.cells.some(ownCell => ownCell === cell);
  }

  markAsProtect(cell: ShipCell): void {
    if (!this.hasProtectsLeft()) {
      throw new Error('No protects left');
    }

    if (!this.isOwnCell(cell)) {
      throw new Error(`Wrong cell to protect, perhaps it is enemy's one`);
    }

    cell.markAsProtected();
    --this.protectsLeft;
  }

  markAsAttack(cell: ShipCell): void {
    if (!this.hasAttacksLeft()) {
      throw new Error('No attacks left');
    }

    if (this.isOwnCell(cell)) {
      throw new Error(`Wrong cell to attack, perhaps it is yours`);
    }

    cell.markAsAttacked();
    --this.attacksLeft;
  }

  aiChooseProtectAndAttack(other: Player): boolean {
    let selectedCellId = 0;
    let selectedCell: ShipCell;
    let actionsTaken = false;

    while (this.hasProtectsLeft()) {
      const aliveCells = this.ship.cells
        .filter(cell => !cell.markedAsProtected);

      if (aliveCells.length === 0) {
        break;
      }

      selectedCellId = Math.floor(Math.random() * aliveCells.length);
      selectedCell = aliveCells[selectedCellId];
      this.markAsProtect(selectedCell);
      actionsTaken = true;
    }

    while (this.hasAttacksLeft()) {
      const otherAliveCells = other.ship.cells
        .filter(cell => !cell.markedAsAttacked);

      if (otherAliveCells.length === 0) {
        break;
      }

      selectedCellId = Math.floor(Math.random() * otherAliveCells.length);
      selectedCell = otherAliveCells[selectedCellId];
      this.markAsAttack(selectedCell);
      actionsTaken = true;
    }

    return actionsTaken;
  }
}
