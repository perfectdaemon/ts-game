import { Vector2 } from './../engine/math/vector2';
import { GameBase } from './../engine/game-base';
import { VertexBuffer } from '../engine/render/vertex-buffer';
import { IndexBuffer } from '../engine/render/index-buffer';
import { ShaderProgram, ShaderType, UniformType } from '../engine/render/shader-program';
import { VertexFormat, IndexFormat } from '../engine/render/webgl-types';
import { Texture } from '../engine/render/texture';

/**
 * Main game class with game loop
 */
export class Game extends GameBase {

  private vertexData = [
    0.0,  0.5, 0.0, 0.5, 0.0,   1.0, 1.0, 1.0, 1.0,
   -0.5, -0.5, 0.0, 0.0, 1.0,   1.0, 1.0, 1.0, 1.0,
    0.5, -0.5, 0.0, 1.0, 1.0,   1.0, 1.0, 1.0, 1.0
  ];

  private vertexShader = `
  attribute vec3 vaCoord;
  attribute vec2 vaTexCoord0;
  attribute vec4 vaColor;

  varying vec4 vColor;
  varying vec2 texCoord0;

  void main(void) {
    texCoord0 = vaTexCoord0;
    vColor = vaColor;
    gl_Position = vec4(vaCoord, 1.0);
  }
  `;

  private fragmentShader = `
  varying highp vec2 texCoord0;
  varying highp vec4 vColor;
  uniform sampler2D uDiffuse;
  uniform highp vec4 uColor;

  void main(void)
  {
    gl_FragColor = texture2D( uDiffuse, texCoord0 );
  }
  `;

  private _vb: VertexBuffer;
  private _ib: IndexBuffer;
  private _shader: ShaderProgram;
  private _texture: Texture;
  private _textureNumber: number;

  constructor(protected canvasElement: HTMLCanvasElement) {
    super(canvasElement);
  }

  protected onInit(): void {
    console.log('Run, TypeScript, run!');
    this.renderer.setClearColorRGB(0.0, 0.2, 1.0, 0.5);

    this._vb = new VertexBuffer(VertexFormat.Pos3Tex2Col4, 3);
    this._vb.update(this.vertexData, 0);

    this._ib = new IndexBuffer(IndexFormat.Byte, 3);
    this._ib.update([0, 1, 2], 0);

    this._shader = new ShaderProgram();
    this._shader.attach(ShaderType.Vertex, this.vertexShader);
    this._shader.attach(ShaderType.Fragment, this.fragmentShader);
    this._shader.link();
    this._textureNumber = <number> this._shader.addUniform(UniformType.Sampler, 1, 'uDiffuse', 0);

    this._texture = new Texture('assets/webgl.png');
  }

  protected onUpdate(timestamp: number): void {

  }

  protected onRender(timestamp: number): void {
    super.onRender(timestamp);
    this._vb.bind();
    this._texture.bind(0);
    this._shader.bind();

    this.renderer.drawTriangles(this._vb, this._ib, 0, 3);
  }

  protected onMouseMove(position: Vector2): void {

  }
}
