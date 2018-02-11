import { Vector2 } from '../../engine/math/vector2';
import { Vector3 } from '../../engine/math/vector3';
import { Material } from '../../engine/render/material';
import { ShaderProgram, ShaderType } from '../../engine/render/shader-program';
import { Texture } from '../../engine/render/texture';
import { SpriteBatch } from '../../engine/render2d/sprite-batch';
import { Camera, CameraPivot, CameraProjectionMode } from '../../engine/scene/camera';
import { Sprite } from '../../engine/scene/sprite';
import { GameBase } from './../../engine/game-base';

export class Game extends GameBase {

  private vertexShader = `
  attribute vec3 vaCoord;
  attribute vec2 vaTexCoord0;
  attribute vec4 vaColor;
  varying vec2 texCoord0;
  varying vec4 vColor;
  uniform mat4 uModelViewProj;

  void main(void)
  {
    texCoord0 = vaTexCoord0;
    vColor = vaColor;
    gl_Position = uModelViewProj * vec4(vaCoord, 1.0);
  }
  `;

  private fragmentShader = `
  varying highp vec2 texCoord0;
  varying highp vec4 vColor;
  uniform sampler2D uDiffuse;
  uniform highp vec4 uColor;

  void main(void)
  {
    gl_FragColor = uColor * vColor * texture2D( uDiffuse, texCoord0 );
    if (gl_FragColor.a < 0.001)
      discard;
  }
  `;

  private _material: Material;
  private _shader: ShaderProgram;
  private _texture: Texture;
  private _sprites: Sprite[] = [];
  private _spriteBatch: SpriteBatch;

  private _camera: Camera;

  constructor(protected canvasElement: HTMLCanvasElement) {
    super(canvasElement);
  }

  protected onInit(): void {
    this.renderer.setClearColorRGB(0.1, 0.2, 0.2, 0.5);

    this._shader = new ShaderProgram();
    this._shader.attach(ShaderType.Vertex, this.vertexShader);
    this._shader.attach(ShaderType.Fragment, this.fragmentShader);
    this._shader.link();

    this._texture = new Texture('assets/webgl.png');

    this._material = new Material(this._shader);
    this._material.addTexture(this._texture, 'uDiffuse');

    for (let i = 0; i < 300; ++i) {
      const sprite = new Sprite(30, 30);
      sprite.rotation = Math.random() * 360;
      sprite.position.set(this.renderer.width * Math.random(), this.renderer.height * Math.random(), 1);
      this._sprites.push(sprite);
    }

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
    this._camera.update();
    this._shader.updateUniformValue('uModelViewProj', this.renderer.renderParams.modelViewProjection.e);
    this._shader.updateUniformValue('uColor', [1, 1, 1, 1]);

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
