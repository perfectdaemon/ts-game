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
import { DEFAULT_MATERIAL_DATA } from './data-assets/default-material';
import { GameAssetLoader } from './data-assets/game-asset-loader';
import { MaterialData } from '../../engine/loaders/material.data';

export class Game extends GameBase {

  private _material: Material;
  private _sprites: Sprite[] = [];
  private _spriteBatch: SpriteBatch;

  private _camera: Camera;

  private ready: boolean = false;
  constructor(protected canvasElement: HTMLCanvasElement) {
    super(canvasElement);
  }

  protected onInit(): void {
    this.renderer.setClearColorRGB(0.1, 0.2, 0.2, 0.5);

    const gameAssetLoader = new GameAssetLoader();

    gameAssetLoader.loadMaterial(DEFAULT_MATERIAL_DATA)
      .then(material => this._material = material)
      .then(() => {
        const landerRegion = (this._material.textures[0].texture as TextureAtlas).getRegion('lander.png');

        for (let i = 0; i < 300; ++i) {
          const sprite = new Sprite(30, 30);
          sprite.setTextureRegion(landerRegion);
          sprite.rotation = Math.random() * 360;
          sprite.position.set(this.renderer.width * Math.random(), this.renderer.height * Math.random(), 1);
          this._sprites.push(sprite);
        }

        this.ready = true;
      });

    this._spriteBatch = new SpriteBatch();

    this._camera = new Camera();
  }

  protected onUpdate(deltaTime: number): void {
    for (const sprite of this._sprites) {
      sprite.rotation += deltaTime * 10;
    }
  }

  protected onRender(): void {
    super.onRender();
    if (!this.ready) { return; }
    this._camera.update();
    this._material.shader.updateUniformValue('uModelViewProj', this.renderer.renderParams.modelViewProjection.e);
    this._material.shader.updateUniformValue('uColor', this.renderer.renderParams.color.asArray());

    this._material.bind();
    this._spriteBatch.start();
    this._spriteBatch.drawArray(this._sprites);
    this._spriteBatch.finish();
  }

  protected onMouseMove(position: Vector2): void {
    // nothing
  }

  protected onMouseDown(position: Vector2): void {
    this.pauseAll = !this.pauseAll;
  }
}
