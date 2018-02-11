import { Matrix4 } from '../math/matrix4';
import { Vector4 } from '../math/vector4';

export class RenderParams {
  public viewProjection: Matrix4 = new Matrix4();
  public model: Matrix4 = new Matrix4();
  public modelViewProjection: Matrix4 = new Matrix4();
  public color: Vector4 = new Vector4(1, 1, 1, 1);

  constructor() {
    this.calculateMVP();
  }
  public calculateMVP(): void {
    this.modelViewProjection = this.viewProjection.multiplyMat(this.model);
  }
}
