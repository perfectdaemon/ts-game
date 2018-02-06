import { Node } from "./node";
import { Vector2 } from "../math/vector2";
import { TextureRegion } from "../render/texture-atlas";
import { Vector4 } from "../math/vector4";
import { isEqual, MathBase } from "../math/math-base";
import { AXIS_Z, Vector3 } from "../math/vector3";

export class Sprite extends Node {
  protected _rotation: number;
  protected _width: number;
  protected _height: number;
  protected _pivotPoint: Vector2;
  protected _textureRegion: TextureRegion;
  public vertices: number[] = new Array(36);

  constructor(width: number | null, height: number | null, pivotPoint: Vector2 | null) {
    super();
    this._width = width || 1.0;
    this._height = height || 1.0;
    this._pivotPoint = pivotPoint || new Vector2(0.5, 0.5);

    this.setDefaultVertices();
    this.setDefaultTexCoords();
    this.setVerticesColor(new Vector4(1, 1, 1, 1));
  }

  free(): void {
    super.free();
  }

  static getVerticesSize(): number {
    return 36;
  }

  get rotation(): number { return this._rotation; }
  set rotation(value: number) {
    if (isEqual(this._rotation, value)) { return; }

    this.matrix.identity();
    this.matrix.rotate(value * MathBase.deg2rad, AXIS_Z)

    this._rotation = value;

    if (this._rotation > 360) {
      this._rotation -= 360;
    } else if (this._rotation < -360) {
      this._rotation += 360;
    }
  }

  get width(): number { return this._width; }
  set width(value: number) {
    if (isEqual(this._width, value)) { return; }

    this._width = value;
    this.setDefaultVertices();
  }

  get height(): number { return this._height; }
  set height(value: number) {
    if (isEqual(this._height, value)) { return; }

    this._height = value;
    this.setDefaultVertices();
  }

  get pivotPoint(): Vector2 { return this._pivotPoint; }
  set pivotPoint(value: Vector2) {
    if (this._pivotPoint.equalTo(value)) { return; }

    this._pivotPoint.set(value.x, value.y);
    this.setDefaultVertices();
  }

  setDefaultVertices(): void {
    this.vertices[0] = (1 - this.pivotPoint.x) * this._width;
    this.vertices[1] = (1 - this.pivotPoint.y) * this._height;
    this.vertices[2] = 0;

    this.vertices[9] = (1 - this.pivotPoint.x) * this._width;
    this.vertices[10] = (0 - this.pivotPoint.y) * this._height;
    this.vertices[11] = 0;

    this.vertices[18] = (0 - this.pivotPoint.x) * this._width;
    this.vertices[19] = (0 - this.pivotPoint.y) * this._height;
    this.vertices[20] = 0;

    this.vertices[27] = (0 - this.pivotPoint.x) * this._width;
    this.vertices[28] = (1 - this.pivotPoint.y) * this._height;
    this.vertices[29] = 0;
  }

  setDefaultTexCoords(): void {
    this.vertices[3] = 1;
    this.vertices[4] = 1;

    this.vertices[12] = 1;
    this.vertices[13] = 0;

    this.vertices[21] = 0;
    this.vertices[22] = 0;

    this.vertices[30] = 0;
    this.vertices[31] = 1;
  }

  setFlippedTexCoords(): void {

    this.vertices[3] = 1;
    this.vertices[4] = 0;

    this.vertices[12] = 1;
    this.vertices[13] = 1;

    this.vertices[21] = 0;
    this.vertices[22] = 1;

    this.vertices[30] = 0;
    this.vertices[31] = 0;
  }

  setVerticesColor(color: Vector4): void {
    for (let i = 5; i < 33; i += 9) {
      this.vertices[i + 0] = color.x;
      this.vertices[i + 1] = color.y;
      this.vertices[i + 2] = color.z;
      this.vertices[i + 3] = color.w;
    }
  }

  setVerticesAlpha(alpha: number): void {
    this.vertices[8] = alpha;
    this.vertices[17] = alpha;
    this.vertices[26] = alpha;
    this.vertices[35] = alpha;
  }

  setSize(width: number, height: number): void {
    if (isEqual(this._width, width) && isEqual(this._height, height)) {
      return;
    }

    this._width = width;
    this._height = height;
    this.setDefaultVertices();
  }

  setSizeFromVector2(size: Vector2): void {
    this.setSize(size.x, size.y);
  }

  setTextureRegion(region: TextureRegion, adjustSpriteSize: boolean = true): void {
    this._textureRegion = region;

    if (region.rotated) {
      this.vertices[3] = region.tx;
      this.vertices[4] = region.ty + region.th;

      this.vertices[12] = region.tx + region.tw;
      this.vertices[13] = region.ty + region.th;

      this.vertices[21] = region.tx + region.tw;
      this.vertices[22] = region.ty;

      this.vertices[30] = region.tx;
      this.vertices[31] = region.ty;

      if (adjustSpriteSize) {
        this.setSize(region.th * region.texture.height, region.tw * region.texture.width);
      }
    } else {
      this.vertices[3] = region.tx + region.tw;
      this.vertices[4] = region.ty + region.th;

      this.vertices[12] = region.tx + region.tw;;
      this.vertices[13] = region.ty;

      this.vertices[21] = region.tx;
      this.vertices[22] = region.ty;

      this.vertices[30] = region.tx;
      this.vertices[31] = region.ty + region.th;

      if (adjustSpriteSize) {
        this.setSize(region.tw * region.texture.width, region.th * region.texture.height);
      }
    }
  }

  getTextureRegion(): TextureRegion {
    return this._textureRegion;
  }

  getVerticesWithAbsoluteMatrix(): number[] {
    const absMatrix = this.absoluteMatrix;

    const vectors = [
      new Vector3(this.vertices[0], this.vertices[1], this.vertices[2]),
      new Vector3(this.vertices[9], this.vertices[10], this.vertices[11]),
      new Vector3(this.vertices[18], this.vertices[19], this.vertices[20]),
      new Vector3(this.vertices[27], this.vertices[28], this.vertices[29]),
    ];

    vectors.forEach(vector => vector = absMatrix.multiplyVec(vector));

    const result = this.vertices.slice();

    result[0] = vectors[0].x;
    result[1] = vectors[0].y;
    result[2] = vectors[0].z;

    result[09] = vectors[1].x;
    result[10] = vectors[1].y;
    result[11] = vectors[1].z;

    result[18] = vectors[2].x;
    result[19] = vectors[2].y;
    result[20] = vectors[2].z;

    result[27] = vectors[3].x;
    result[28] = vectors[3].y;
    result[29] = vectors[3].z;

    return result;
  }

  renderSelf(): void {
    // nothing
  }

}
