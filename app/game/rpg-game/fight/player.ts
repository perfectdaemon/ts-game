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

    for (let i = 0; i < playerData.cellCount; ++i) {
      const cell = new ShipCell();
      cell.health = playerData.maxCellHealth;
      player.ship.cells.push(cell);
    }

    player.playerData = playerData;
    player.resetTurnState();

    PlayerRenderableHelper.build(player);

    return player;
  }

  playerData: PlayerData;

  protectedCells: ShipCell[] = [];
  attackedCells: ShipCell[] = [];

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
    this.protectedCells = [];
    this.attackedCells = [];
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

    this.protectedCells.push(cell);
    --this.protectsLeft;
  }

  markAsAttack(cell: ShipCell): void {
    if (!this.hasAttacksLeft()) {
      throw new Error('No attacks left');
    }

    if (this.isOwnCell(cell)) {
      throw new Error(`Wrong cell to attack, perhaps it is yours`);
    }

    this.attackedCells.push(cell);
    --this.attacksLeft;
  }

  aiChooseProtectAndAttack(other: Player): boolean {
    let selectedCellId = 0;
    let selectedCell: ShipCell;
    let actionsTaken = false;

    while (this.hasProtectsLeft()) {
      const aliveCells = this.ship.cells
        .filter(cell => cell.isAlive() && this.protectedCells.every(protectedCell => protectedCell !== cell));

      if (aliveCells.length === 0) {
        break;
      }

      selectedCellId = Math.floor(Math.random() * aliveCells.length);
      selectedCell = this.ship.cells[selectedCellId];
      this.markAsProtect(selectedCell);
      actionsTaken = true;
    }

    while (this.hasAttacksLeft()) {
      const otherAliveCells = other.ship.cells
        .filter(cell => cell.isAlive() && this.attackedCells.every(attackedCell => attackedCell !== cell));

      if (otherAliveCells.length === 0) {
        break;
      }

      selectedCellId = Math.floor(Math.random() * otherAliveCells.length);
      selectedCell = other.ship.cells[selectedCellId];
      this.markAsAttack(selectedCell);
      actionsTaken = true;
    }

    return actionsTaken;
  }
}
