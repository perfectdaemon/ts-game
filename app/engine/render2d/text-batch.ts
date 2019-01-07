import { Vector2 } from '../math/vector2';
import { Vector3 } from '../math/vector3';
import { Vector4 } from '../math/vector4';
import { Font } from '../render/font';
import { IndexBuffer } from '../render/index-buffer';
import { VertexBuffer } from '../render/vertex-buffer';
import { renderer } from '../render/webgl';
import { IndexFormat, VertexFormat } from '../render/webgl-types';
import { Text } from '../scene/text';

const SPRITE_INDICES: number[] = [0, 1, 2, 2, 3, 0];
const SPRITE_VERTICES_SIZE = 36;

export class TextBatch {
  private _vertexBuffer: VertexBuffer;
  private _indexBuffer: IndexBuffer;
  private _count: number = 0;
  private _changed: boolean = false;

  private _vertexData: number[] = new Array(65536);
  private _indexData: number[] = new Array(65536);

  private _textOrigin: Vector2 = new Vector2();
  private _start: Vector2 = new Vector2();

  /**
   * Constructs new TextBatch object
   */
  constructor(public font: Font) {
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

    this.font.material.bind();
    renderer.renderParams.modelViewProjection = renderer.renderParams.viewProjection;
    renderer.drawTriangles(this._vertexBuffer, this._indexBuffer, 0, this._count * 6);
  }

  /**
   * Include single text in batch
   * @param text
   */
  drawSingle(text: Text): void {
    if (!text.visible || text.text === '') { return; }

    if (text.maxTextWidth > 0 && text.isWrapped) {
      this.wrapText(text);
    }

    if (text.shadowEnabled) {
      this.drawShadow(text);
    }

    this.calculateTextOrigin(text);
    this._start.set(this._textOrigin);

    for (const symbol of text.text) {
      if (symbol === '\n') {
        this._start.x = this._textOrigin.x;
        this._start.y += text.scale * (text.lineSpacing + this.font.maxSymbolHeight);
        continue;
      }

      if (!this.font.hasFontData(symbol)) {
        continue;
      }

      const quad = this.font.getSymbolQuad(symbol, text.scale);
      const width = quad.positions[0].x;

      for (let vert = 0; vert < 4; ++vert) {
        quad.positions[vert].addToSelf(this._start);
        quad.positions[vert].multiplyMatSelf(text.absoluteMatrix);
        quad.colors[vert].set(text.color);
      }

      const vertices = quad.toArray();

      for (let i = 0; i < SPRITE_VERTICES_SIZE; ++i) {
        this._vertexData[this._count * SPRITE_VERTICES_SIZE + i] = vertices[i];
      }

      for (let i = 0; i < 6; ++i) {
        this._indexData[this._count * 6 + i] = SPRITE_INDICES[i] + this._count * 4;
      }
      this._start.x += width + text.letterSpacing;
      ++this._count;
      this._changed = true;
    }
  }

  /**
   * Include array of texts in batch
   * @param texts
   */
  drawArray(texts: Text[]): void {
    texts.forEach(text => this.drawSingle(text));
  }

  private wrapText(text: Text): void {
    const result: string[] = [];
    const words = text.text.replace(/\s+/gm, ' ').split(/\s/gm);
    let spaceLeft = text.maxTextWidth;

    for (const word of words) {
      const wordLength = this.font.getTextLength(word, true) * text.scale;
      if (wordLength < spaceLeft) {
        result.push(word + ' ');
        spaceLeft -= wordLength;
      } else {
        result.push('\n');
        result.push(word + ' ');
        spaceLeft = text.maxTextWidth - wordLength;
      }
    }

    text.isWrapped = true;
    text.text = result.join('');
  }

  private drawShadow(text: Text): void {
    const textPosition = new Vector3().set(text.position);
    const textColor = new Vector4().set(text.color);

    text.position.addToSelf(text.shadowOffset);
    text.position.z -= 1;
    text.color.set(text.shadowColor);
    text.shadowEnabled = false;

    this.drawSingle(text);

    text.position.set(textPosition);
    text.color.set(textColor);
    text.shadowEnabled = true;
  }

  private calculateTextOrigin(text: Text): void {
    let maxWidth = 0;
    const textSize = new Vector2();

    for (const symbol of text.text) {
      if (symbol === '\n') {
        textSize.y += this.font.maxSymbolHeight + text.lineSpacing;

        if (maxWidth > textSize.x) {
          textSize.x = maxWidth;
        }

        maxWidth = 0;
        continue;
      }

      if (!this.font.hasFontData(symbol)) { continue; }

      const symbolData = this.font.fontData[symbol];
      if (textSize.y < 1 && symbolData.height > 0) {
        textSize.y = this.font.maxSymbolHeight + text.lineSpacing;
      }

      maxWidth += symbolData.width + text.letterSpacing;
    }

    textSize.x = Math.max(textSize.x, maxWidth);
    textSize.multiplyNumSelf(text.scale);

    this._textOrigin
      .set(textSize)
      .multiplyNumSelf(-1)
      .multiplyVecSelf(text.pivotPoint);
  }
}
