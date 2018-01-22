import { Node } from "./node";
import { Matrix4 } from "../math/matrix4";
import { Vector3 } from "../math/vector3";
import { Vector2 } from "../math/vector2";
import { renderer } from "../render/webgl";

export enum CameraProjectionMode { Ortho, Perspective };

export enum CameraPivot { TopLeft, Center, BottomRight };

export class Camera extends Node {
  protected _projectionMode: CameraProjectionMode;
  protected _pivotMode: CameraPivot;

  protected _scale: number = 1.0;
  protected _fov: number;
  protected _zNear: number;
  protected _zFar: number;

  protected _x: number;
  protected _y: number;
  protected _w: number;
  protected _h: number;

  protected rebuildProjectionMatrix(): void {
    this.projectionMatrix.identity();

    switch (this._projectionMode) {
      case CameraProjectionMode.Perspective:
        this.projectionMatrix.perspective(this._fov, this._w / this._h, this._zNear, this._zFar); break;

      case CameraProjectionMode.Ortho:
        const scale2 = 2 * this._scale;

        switch (this._pivotMode) {
          case CameraPivot.TopLeft:
            this.projectionMatrix.ortho(0, this._w / this._scale, this._h / this._scale, 0, this._zNear, this._zFar);
            break;

          case CameraPivot.Center:
            this.projectionMatrix.ortho(- this._w / scale2, this._w / scale2, this._h / scale2, - this._h / scale2, this._zNear, this._zFar);
            break;

          case CameraPivot.BottomRight:
            this.projectionMatrix.ortho(- this._w / scale2, 0, 0, - this._h / scale2, this._zNear, this._zFar);
            break;
        }
        break;
    }
  }

  public projectionMatrix: Matrix4;

  constructor() {
    super();
    this.setProjectionParamsFull(0, 0, renderer.width, renderer.height, 45, 0.01, 100, CameraProjectionMode.Ortho, CameraPivot.TopLeft);
    this.setViewParams(new Vector3(0, 0, 100), new Vector3(0, 0, 0), new Vector3(0, 1, 0));
  }

  public setProjectionParams(x: number, y: number, w: number, h: number): void {
    w = w < 0 ? 1 : w;
    h = h < 0 ? 1 : h;

    this._x = x;
    this._y = y;
    this._w = w;
    this._h = h;

    this.rebuildProjectionMatrix();
  }

  public setProjectionParamsFull(x: number, y: number, w: number, h: number,
    fov: number, zNear: number, zFar: number,
    projectionMode: CameraProjectionMode, pivotMode: CameraPivot): void {
    this._fov = fov;
    this._zNear = zNear;
    this._zFar = zFar;
    this._projectionMode = projectionMode;
    this._pivotMode = pivotMode;

    this.setProjectionParams(x, y, w, h);
  }

  public setViewParams(position: Vector3, targetPosition: Vector3, up: Vector3): void {
    this.matrix.identity();

    this._up = up.normal();
    this._dir = targetPosition.subtract(position).normal();
    this._right = this._dir.cross(this._up).normal();
    this._up = this._right.cross(this._dir).normal(); // wtf?
    this.position = position;
    this._dir.negate();

    this.matrix.e = [
      this._right.x, this._right.y, this._right.z, this._right.negateVector().dot(this.position),
      this._up.x, this._up.y, this._up.z, this._up.negateVector().dot(this.position),
      this._dir.x, this._dir.y, this._dir.z, this._dir.negateVector().dot(this.position),
      0, 0, 0, 1
    ];

    this.matrix = this.matrix.transpose();
    this.updateVectorsFromMatrix();
  }

  public translate(alongUpVector: number, alongRightVector: number, alongDirVector: number): void {
    const translate = this._up.multiplyNum(alongUpVector)
      .add(this._right.multiplyNum(alongRightVector))
      .add(this._dir.multiplyNum(alongDirVector));

    this.position.addToSelf(translate);
  }

  public rotate(delta: number, axis: Vector3): void {
    this.matrix.rotate(delta, axis);
    this.updateVectorsFromMatrix();
  }

  public get scale(): number { return this._scale; }
  public set scale(scale: number) {
    if (scale === this._scale) { return; }

    this._scale = scale;
    this.rebuildProjectionMatrix();
  }

  public screenToWorld(screenPosition: Vector2): Vector3 {

  }

  public renderSelf(): void {
    super.renderSelf();
  }

  public update(): void {

  }
}
