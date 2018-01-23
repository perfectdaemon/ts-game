import { Vector3 } from "../math/vector3";
import { Matrix4 } from "../math/matrix4";
import { renderer } from "../render/webgl";

export class Node {
  public matrix: Matrix4;
  public position: Vector3;
  public visible: boolean;

  public get parent(): Node | null { return this._parent; }
  public get up(): Vector3 { return this._up; }
  public get direction(): Vector3 { return this._dir; }
  public get right(): Vector3 { return this._right; }

  public get absoluteMatrix(): Matrix4 {
    this.matrix.position = this.position;

    this._absoluteMatrix = this._parent === null
      ? this.matrix
      : this._parent.absoluteMatrix.multiplyMat(this.matrix);

    return this._absoluteMatrix;
  }

  protected _dir: Vector3;
  protected _right: Vector3;
  protected _up: Vector3;
  protected _parent: Node | null;
  protected _absoluteMatrix: Matrix4;
  protected _visible: boolean;

  constructor() {
    this.matrix.identity();
    this.parent = null;
    this.updateVectorsFromMatrix();
  }

  public free(): void { }

  public set absoluteMatrix(matrix: Matrix4) { this._absoluteMatrix = matrix; }

  public set parent(parent: Node | null) {
    if (this._parent === parent) { return; }

    this._parent = parent;
  }

  public set direction(direction: Vector3) {
    if (direction === this._dir) { return; }

    direction.normalize();
    const newRight = this._up
      .cross(direction)
      .negate()
      .normalize();
    const newUp = direction
      .cross(newRight)
      .normalize();
    this.updateModelMatrix(direction, newUp, newRight);
  }

  public set right(right: Vector3) {
    if (right === this._right) { return; }

    right.normalize();
    const newDirection = right
      .cross(this._up)
      .normalize();
    const newUp = newDirection
      .cross(right)
      .normalize();
    this.updateModelMatrix(newDirection, newUp, right);
  }

  public set up(up: Vector3) {
    if (up === this._up) { return; }

    up.normalize();
    const newRight = up
      .cross(this._dir)
      .negate()
      .normalize();
    const newDirection = newRight
      .cross(this._up)
      .normalize();
    this.updateModelMatrix(newDirection, up, newRight);
  }

  public renderSelf(): void {
    renderer.renderParams.model = this.absoluteMatrix;
    renderer.renderParams.calculateMVP();

    this.updateVectorsFromMatrix();

    if (!this.visible) { return; }

    this.doRender();
  }

  protected updateModelMatrix(dir: Vector3, up: Vector3, right: Vector3): void {
    this.matrix.e = [
      right.x, up.x, dir.x, 0,
      right.y, up.y, dir.y, 0,
      right.z, up.z, dir.z, 0,
      this.position.dot(right), this.position.dot(up), this.position.dot(dir)
    ];

    this._dir = dir;
    this._up = up;
    this._right = right;
  }

  protected updateVectorsFromMatrix(): void {
    this._right.set(this.matrix.e[0], this.matrix.e[4], this.matrix.e[8]);
    this._up.set(this.matrix.e[1], this.matrix.e[5], this.matrix.e[9]);
    this._dir.set(this.matrix.e[2], this.matrix.e[6], this.matrix.e[10]);
  }

  protected doRender(): void { }
}
