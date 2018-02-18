import { Keys } from '../../engine/input/keys.enum';
import { Vector2 } from '../../engine/math/vector2';
import { Vector3 } from '../../engine/math/vector3';
import { Material } from '../../engine/render/material';
import { ShaderProgram, ShaderType } from '../../engine/render/shader-program';
import { Texture } from '../../engine/render/texture';
import { TextureAtlas } from '../../engine/render/texture-atlas';
import { SpriteBatch } from '../../engine/render2d/sprite-batch';
import { Camera, CameraPivot, CameraProjectionMode } from '../../engine/scene/camera';
import { Sprite } from '../../engine/scene/sprite';
import { GameBase } from './../../engine/game-base';
import { Assets } from './assets';
import { Player } from './player';

export class Game extends GameBase {
  spriteBatch: SpriteBatch = new SpriteBatch();
  spriteBatch2: SpriteBatch = new SpriteBatch();

  camera: Camera = new Camera();
  assets: Assets = new Assets();
  player: Player = new Player(this.input);

  private ready: boolean = false;

  constructor(protected canvasElement: HTMLCanvasElement) {
    super(canvasElement);
  }

  protected onInit(): void {
    this.player.body.position.set(this.renderer.width / 2, this.renderer.height / 2, 1);
    this.player.weapon.position.set(24, 0, -1);
    this.assets.loadAll()
      .then(() => {
        this.ready = true;
        this.player.weapon.setTextureRegion(this.assets.textureAtlas.getRegion('pistol2.png'), true);
        this.player.weapon.multSize(2);
      });

    this.renderer.setClearColorRGB(0.1, 0.2, 0.2, 0.5);
  }

  protected onUpdate(deltaTime: number): void {
    this.player.onUpdate(deltaTime);
  }

  protected onRender(): void {
    super.onRender();
    if (!this.ready) { return; }
    this.camera.update();
    this.assets.shader.updateUniformValue('uModelViewProj', this.renderer.renderParams.modelViewProjection.e);
    this.assets.shader.updateUniformValue('uColor', this.renderer.renderParams.color.asArray());

    this.assets.material.bind();
    this.spriteBatch2.start();
    this.spriteBatch2.drawSingle(this.player.weapon);
    this.spriteBatch2.finish();

    this.assets.characterMaterial.bind();
    this.spriteBatch.start();
    this.spriteBatch.drawSingle(this.player.body);
    this.spriteBatch.finish();
  }

  protected onMouseMove(position: Vector2): void {
    // nothing
  }

  protected onMouseDown(position: Vector2): void {
    // this.pauseAll = !this.pauseAll;
  }

  protected onKeyDown(key: Keys): void {
    // nothing
  }
  protected onKeyUp(key: Keys): void {
    // nothing
  }
}
