import { Node } from "./node";
import { Matrix4 } from "../math/matrix4";
import { Vector3 } from "../math/vector3";
import { Vector2 } from "../math/vector2";
import { renderer } from "../render/webgl";

export enum CameraProjectionMode { Ortho, Perspective };

export enum CameraPivot { TopLeft, Center, BottomRight };

export class Camera extends Node {
  public projectionMatrix: Matrix4;

  public get scale(): number { return this._scale; }
  public set scale(scale: number) {
    if (scale === this._scale) { return; }

    this._scale = scale;
    this.rebuildProjectionMatrix();
  }

  protected _projectionMode: CameraProjectionMode;
  protected _pivotMode: CameraPivot;

  protected _scale: number = 1.0;
  protected _fov: number;
  protected _zNear: number;
  protected _zFar: number;

  protected _x: number;
  protected _y: number;
  protected _width: number;
  protected _height: number;

  protected rebuildProjectionMatrix(): void {
    this.projectionMatrix.identity();

    switch (this._projectionMode) {
      case CameraProjectionMode.Perspective:
        this.projectionMatrix.perspective(this._fov, this._width / this._height, this._zNear, this._zFar); break;

      case CameraProjectionMode.Ortho:
        const scale2 = 2 * this._scale;

        switch (this._pivotMode) {
          case CameraPivot.TopLeft:
            this.projectionMatrix.ortho(0, this._width / this._scale, this._height / this._scale, 0, this._zNear, this._zFar);
            break;

          case CameraPivot.Center:
            this.projectionMatrix.ortho(- this._width / scale2, this._width / scale2, this._height / scale2, - this._height / scale2, this._zNear, this._zFar);
            break;

          case CameraPivot.BottomRight:
            this.projectionMatrix.ortho(- this._width / scale2, 0, 0, - this._height / scale2, this._zNear, this._zFar);
            break;
        }
        break;
    }
  }

  constructor() {
    super();
    this.setProjectionParamsFull(0, 0, renderer.width, renderer.height, 45, 0.01, 100, CameraProjectionMode.Ortho, CameraPivot.TopLeft);
    this.setViewParams(new Vector3(0, 0, 100), new Vector3(0, 0, 0), new Vector3(0, 1, 0));
  }

  public setProjectionParams(x: number, y: number, width: number, height: number): void {
    width = width < 0 ? 1 : width;
    height = height < 0 ? 1 : height;

    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;

    this.rebuildProjectionMatrix();
  }

  public setProjectionParamsFull(x: number, y: number, width: number, height: number,
    fov: number, zNear: number, zFar: number,
    projectionMode: CameraProjectionMode, pivotMode: CameraPivot): void {
    this._fov = fov;
    this._zNear = zNear;
    this._zFar = zFar;
    this._projectionMode = projectionMode;
    this._pivotMode = pivotMode;

    this.setProjectionParams(x, y, width, height);
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

  public screenToWorld(screenPosition: Vector2): Vector3 {
    if (this._projectionMode === CameraProjectionMode.Perspective) {
      console.error('Camera.ScreenToWorld() with perpective camera is not implemented');
      return new Vector3(0, 0, 0);
    }

    const result = Vector2
      .fromVector3(this.position)
      .addToSelf(screenPosition.multiply(1 / this._scale));

    const pivotOffset = new Vector2(0, 0);

    switch (this._pivotMode) {
      case CameraPivot.Center:
        pivotOffset.set(this._width / (2 * this._scale), this._height / (2 * this._scale));
        break;

      case CameraPivot.BottomRight:
        pivotOffset.set(this._width / this._scale, this._height / this._scale);
        break;
    }

    result.subtractFromSelf(pivotOffset);

    return new Vector3(result.x, result.y, 0);
  }

  public renderSelf(): void {
    // nothing
  }

  public update(): void {
    this.matrix.position.set(0, 0, 0);
    this.matrix.position = this.matrix.multiplyVec(this.position.negateVector());

    renderer.renderParams.viewProjection = this.projectionMatrix.multiplyMat(this.matrix);
    renderer.renderParams.modelViewProjection = renderer.renderParams.viewProjection;
    this.updateVectorsFromMatrix();

    if (renderer.width !== this._width || renderer.height !== this._height) {
      this.setProjectionParams(0, 0, renderer.width, renderer.height);
    }
  }
}
