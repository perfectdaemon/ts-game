import { Vector2 } from './../engine/math/vector';
import { GameBase } from './../engine/game-base';
import { VertexBuffer } from '../engine/render/vertex-buffer';
import { IndexBuffer } from '../engine/render/index-buffer';
import { ShaderProgram, ShaderType } from '../engine/render/shader-program';
import { VertexFormat, IndexFormat } from '../engine/render/webgl-types';

/**
 * Main game class with game loop
 */
export class Game extends GameBase {

  private vertexData = [
    0.0,  0.5, 0.0, 1.0, 1.0,   1.0, 0.0, 0.0, 1.0,
   -0.5, -0.5, 0.0, 1.0, 1.0,   0.0, 1.0, 0.0, 1.0,
    0.5, -0.5, 0.0, 1.0, 1.0,   0.0, 0.0, 1.0, 1.0
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
  varying lowp vec2 texCoord0;
  varying lowp vec4 vColor;

  void main(void)
  {
    gl_FragColor = vColor;
  }
  `;

  private _vb: VertexBuffer;
  private _ib: IndexBuffer;
  private _shader: ShaderProgram;

  constructor(protected canvasElement: HTMLCanvasElement) {
    super(canvasElement);

    this._vb = new VertexBuffer(VertexFormat.Pos3Tex2Col4, 3);
    this._vb.update(this.vertexData, 0);

    this._ib = new IndexBuffer(IndexFormat.Byte, 3);
    this._ib.update([0, 1, 2], 0);


    this._shader = new ShaderProgram();
    this._shader.attach(ShaderType.Vertex, this.vertexShader);
    this._shader.attach(ShaderType.Fragment, this.fragmentShader);
    this._shader.link();
  }

  protected onInit(): void {
    console.log('Run, TypeScript, run!');
    this.renderer.setClearColorRGB(0.0, 0.2, 1.0, 0.5);


  }

  protected onUpdate(timestamp: number): void {

  }

  protected onRender(timestamp: number): void {
    super.onRender(timestamp);
    this._vb.bind();
    this._shader.bind();
    this.renderer.drawTriangles(this._vb, this._ib, 0, 3);
  }

  protected onMouseMove(position: Vector2): void {

  }
}
