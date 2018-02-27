import { IndexBuffer } from '../render/index-buffer';
import { VertexBuffer } from '../render/vertex-buffer';
import { renderer } from '../render/webgl';
import { IndexFormat, VertexFormat } from '../render/webgl-types';
import { Sprite } from '../scene/sprite';

const SPRITE_INDICES: number[] = [0, 1, 2, 2, 3, 0];
const SPRITE_VERTICES_SIZE = Sprite.getVerticesSize();

/**
 * Effective Sprite renderer
 */
export class SpriteBatch {
  private _vertexBuffer: VertexBuffer;
  private _indexBuffer: IndexBuffer;
  private _count: number = 0;
  private _changed: boolean = false;

  private _vertexData: number[] = new Array(65536);
  private _indexData: number[] = new Array(65536);

  /**
   * Constructs new SpriteBatch object
   */
  constructor() {
    this._vertexBuffer = new VertexBuffer(VertexFormat.Pos3Tex2Col4, 65536);
    this._indexBuffer = new IndexBuffer(IndexFormat.Short, 65536);
  }

  /**
   * Frees resources
   */
  free(): void {
    this._vertexBuffer.free();
    this._indexBuffer.free();
  }

  /**
   * Starts new batch
   */
  start(): void {
    this._count = 0;
  }

  /**
   * Finishes batchs and initiate rendering
   */
  finish(): void {
    if (this._count === 0) { return; }

    if (this._changed) {
      this._vertexBuffer.update(this._vertexData, 0);
      this._indexBuffer.update(this._indexData, 0);
    }

    renderer.renderParams.modelViewProjection = renderer.renderParams.viewProjection;
    renderer.drawTriangles(this._vertexBuffer, this._indexBuffer, 0, this._count * 6);
  }

  /**
   * Include single sprite in batch
   * @param sprite
   */
  drawSingle(sprite: Sprite): void {
    if (!sprite.visible) { return; }

    const vertices = sprite.getVerticesWithAbsoluteMatrix();
    for (let i = 0; i < SPRITE_VERTICES_SIZE; ++i) {
      this._vertexData[this._count * SPRITE_VERTICES_SIZE + i] = vertices[i];
    }

    for (let i = 0; i < 6; ++i) {
      this._indexData[this._count * 6 + i] = SPRITE_INDICES[i] + this._count * 4;
    }

    ++this._count;
    this._changed = true;
  }

  /**
   * Include array of sprites in batch
   * @param sprites
   */
  drawArray(sprites: Sprite[]): void {
    sprites.forEach(sprite => this.drawSingle(sprite));
  }
}
