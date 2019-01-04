import { ActionManager } from '../../../engine/helpers/action-manager/action-manager';
import { Keys, MouseButtons } from '../../../engine/input/keys.enum';
import { Vector2 } from '../../../engine/math/vector2';
import { Scene } from '../../../engine/scenes/scene';
import { DialogBox } from '../dialog-box';
import { FIGHT_GAME_STATE } from '../fight/game-state';
import { Player } from '../fight/player';
import { GLOBAL } from '../global';
import { Particle, ParticleEmitter } from '../particles';
import { RenderHelper } from '../render-helper';

export enum FightState {
  Start,
  HumanTurnProtect,
  HumanTurnAttack,
  AiTurn,
  Animation,
  Victory,
  Defeat,
}

export class FightScene extends Scene {
  human: Player;
  enemy: Player;
  fightState: FightState;
  turnNumber: number;

  actionManager: ActionManager;

  dialog: DialogBox;

  renderHelper: RenderHelper;
  emitter: ParticleEmitter;

  constructor() {
    super();
  }

  load(): Promise<void> {
    console.log('Fight scene is loaded');
    this.actionManager = new ActionManager();
    this.renderHelper = new RenderHelper(GLOBAL.assets.font, GLOBAL.assets.blankMaterial);
    this.emitter = new ParticleEmitter(
      this.renderHelper.spriteBatch,
      GLOBAL.assets.solarMaterial,
      () => this.createSmallParticle(),
      64,
    );
    this.dialog = new DialogBox();
    this.reset();
    return super.load();
  }

  render(): void {
    GLOBAL.assets.gameCamera.update();
    this.renderHelper.render([this.human, this.enemy, this.dialog]);
    this.emitter.render();
  }

  update(deltaTime: number): void {
    this.actionManager.update(deltaTime);
    this.emitter.update(deltaTime);
  }

  onKeyDown(key: Keys): void {
  }

  onMouseDown(position: Vector2, button: MouseButtons): void {
    if (button !== Keys.LeftButton) {
      return;
    }

    const worldPosition = GLOBAL.assets.gameCamera
      .screenToWorld(position)
      .asVector2();

    if (this.fightState === FightState.HumanTurnProtect) {
      const result = this.human.ship.cells.filter(c => c.isMouseOver(worldPosition));
      if (result.length > 1) { throw new Error('Hit too many cells'); }
      if (result.length === 0) { return; }

      const cell = result[0];

      this.human.markAsProtect(cell);

      const hasMoreCellsToProtect = this.human.ship.cells
        .some(c => c.isAlive() && this.human.protectedCells.every(a => a !== c));

      if (this.human.hasProtectsLeft() && hasMoreCellsToProtect) {
        this.setFightState(FightState.HumanTurnProtect);
      } else {
        this.setFightState(FightState.HumanTurnAttack);
      }
    } else if (this.fightState === FightState.HumanTurnAttack) {
      const result = this.enemy.ship.cells.filter(c => c.isMouseOver(worldPosition));
      if (result.length > 1) { throw new Error('Hit too many cells'); }
      if (result.length === 0) { return; }

      const cell = result[0];

      this.human.markAsAttack(cell);

      const hasMoreCellsToAttack = this.enemy.ship.cells
        .some(c => c.isAlive() && this.human.attackedCells.every(a => a !== c));

      if (this.human.hasAttacksLeft() && hasMoreCellsToAttack) {
        this.setFightState(FightState.HumanTurnAttack);
      } else {
        this.setFightState(FightState.AiTurn);
        this.actionManager.add(() => this.enemy.aiChooseProtectAndAttack(this.human))
          .then(() => this.setFightState(FightState.Animation), 2.0)
          .then(() => this.calculateTurn(this.human, this.enemy), 2.0)
          .then(() => this.calculateTurn(this.enemy, this.human), 6.0)
          .then(() => {
            const isHumanVictory = this.enemy.ship.cells.every(c => !c.isAlive());
            const isEnemyVictory = this.human.ship.cells.every(c => !c.isAlive());

            if (isEnemyVictory) {
              this.setFightState(FightState.Defeat);
            } else if (isHumanVictory) {
              this.setFightState(FightState.Victory);
            } else {
              this.setFightState(FightState.Start);
            }
          }, 5);
      }
    }
  }

  onMouseMove(position: Vector2): void {
  }

  onMouseUp(position: Vector2, button: MouseButtons): void {
  }

  private reset(): void {
    this.turnNumber = 1;
    this.human = Player.build(FIGHT_GAME_STATE.humanData);
    this.enemy = Player.build(FIGHT_GAME_STATE.enemyData);
    this.setFightState(FightState.Start);
  }

  private calculateTurn(first: Player, second: Player): void {
    let pauseOnStart = 0;
    first.attackedCells.forEach(attackedCell => this.actionManager.add(() => {
      const isCellProtected = second.protectedCells.some(cell => cell === attackedCell);
      const damageMultiplier = isCellProtected
        ? second.playerData.protectMultiplier
        : 1.0;
      attackedCell.hit(first.playerData.attackDamage * damageMultiplier);

      const cellAbsolutePosition = attackedCell.renderable.sprite.absoluteMatrix.position.asVector2();

      if (attackedCell.isAlive()) {
        if (isCellProtected) {
          this.emitHitWithShield(cellAbsolutePosition);
        } else {
          this.emitHit(cellAbsolutePosition);
        }
      } else {
        this.emitCellBoom(cellAbsolutePosition);
      }

    }, pauseOnStart += 2));
  }

  private setFightState(newState: FightState): void {
    switch (newState) {
      case FightState.Start:
        this.dialog.text.text = `Раунд ${this.turnNumber++}`;
        this.human.resetTurnState();
        this.enemy.resetTurnState();
        this.actionManager.add(() => this.setFightState(FightState.HumanTurnProtect), 3.0);
        break;

      case FightState.HumanTurnProtect:
        this.dialog.text.text = `Выберите ${this.human.protectsLeft} своих отсека для защиты`;
        break;

      case FightState.HumanTurnAttack:
        this.dialog.text.text = `Выберите ${this.human.attacksLeft} отсека противника для атаки`;
        break;

      case FightState.AiTurn:
        this.dialog.text.text = `Ход противника`;
        break;

      case FightState.Animation:
        this.dialog.text.text = `Рассчитываем бой...`;
        break;

      case FightState.Victory:
        this.dialog.text.text = `Вы победили!`;
        break;

      case FightState.Defeat:
        this.dialog.text.text = `Вы проиграли!`;
        break;
    }

    this.fightState = newState;
  }

  private createSmallParticle(): Particle {
    const particle = new Particle();
    particle.sprite.position.set(0, 0, 50);
    const textureRegion = GLOBAL.assets.solarAtlas.getRegion('circle.png');
    particle.sprite.setTextureRegion(textureRegion, false);
    return particle;
  }

  private emitHit(position: Vector2): void {
    for (let i = 0; i < 32; ++i) {
      const particle = this.emitter.get();

      const size = 5 + 5 * Math.random();
      particle.sprite.setSize(size, size);
      particle.sprite.setDefaultVertices();

      particle.sprite.position
        .set(position)
        .addToSelf(new Vector2(5 - 10 * Math.random(), 5 - 10 * Math.random()));

      particle.sprite.rotation = 360 * Math.random();

      particle.sprite.setVerticesColor(
        0.9 + 0.1 * Math.random(),
        0.2 + 0.1 * Math.random(),
        0.0 + 0.1 * Math.random(),
        1.0);

      particle.pause = 0.1 * Math.random();
      particle.lifeTime = 1.0 + 0.6 * Math.random();
      particle.velocity = Vector2
        .fromAngle(360 * Math.random())
        .multiplyNumSelf(60 + 140 * Math.random());
    }
  }

  private emitHitWithShield(position: Vector2): void {
    for (let i = 0; i < 32; ++i) {
      const particle = this.emitter.get();

      const size = 5 + 5 * Math.random();
      particle.sprite.setSize(size, size);
      particle.sprite.setDefaultVertices();

      particle.sprite.position
        .set(position)
        .addToSelf(new Vector2(5 - 10 * Math.random(), 5 - 10 * Math.random()));

      particle.sprite.rotation = 360 * Math.random();

      if (i < 16) {
        particle.sprite.setVerticesColor(1.0, 0.8, 0.2, 1.0);
      } else {
        particle.sprite.setVerticesColor(0.1, 0.2, 1.0, 1.0);
      }

      particle.pause = 0.1 * Math.random();
      particle.lifeTime = 0.6 + Math.random();
      particle.velocity = Vector2
        .fromAngle(360 * Math.random())
        .multiplyNumSelf(60 + 140 * Math.random());
    }
  }

  private emitCellBoom(position: Vector2): void {
    for (let i = 0; i < 64; ++i) {
      const particle = this.emitter.get();

      const size = 1 + 10 * Math.random();
      particle.sprite.setSize(size, size);
      particle.sprite.setDefaultVertices();

      particle.sprite.position
        .set(position)
        .addToSelf(new Vector2(5 - 10 * Math.random(), 5 - 10 * Math.random()));

      particle.sprite.rotation = 360 * Math.random();

      particle.sprite.setVerticesColor(1.0, 0.1, 0.1, 1.0);

      particle.pause = 0.2 * Math.random();
      particle.lifeTime = 2.0 + Math.random();
      particle.velocity = Vector2
        .fromAngle(360 * Math.random())
        .multiplyNumSelf(140 + 100 * Math.random());
    }
  }
}
