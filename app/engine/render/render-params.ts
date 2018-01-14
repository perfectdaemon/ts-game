import { Matrix4 } from "../math/matrix4";
import { Vector4 } from "../math/vector4";

export class RenderParams {
  viewProjection: Matrix4 = new Matrix4();
  model: Matrix4 = new Matrix4();
  modelViewProjection: Matrix4;
  color: Vector4 = new Vector4(1, 1, 1, 1);

  public calculateMVP(): void {
    this.modelViewProjection = this.viewProjection.multiply(this.model);
  }
}
