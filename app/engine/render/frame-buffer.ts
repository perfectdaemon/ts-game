import { gl } from "./webgl";
import { Texture } from "./texture";

export class FrameBuffer {
  public buffer: WebGLBuffer;

  public bind(): void {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer);
  }

  public static unbind(): void {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  constructor() {
    this.buffer = <WebGLBuffer>gl.createFramebuffer();
    if (!this.buffer) {
      console.log('Error while creating Frame Buffer');
      return;
    }
  }

  public free(): void {
    gl.deleteBuffer(this.buffer);
  }

  public attachTexture(texture: Texture): void {

    this.bind();
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.texture, 0);
    FrameBuffer.unbind();
  }

}
