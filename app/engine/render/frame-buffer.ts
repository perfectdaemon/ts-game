import { Texture } from './texture';
import { gl } from './webgl';

export class FrameBuffer {
  public static unbind(): void {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  public buffer: WebGLBuffer;

  constructor() {
    this.buffer = gl.createFramebuffer() as WebGLBuffer;
    if (!this.buffer) {
      console.log('Error while creating Frame Buffer');
      return;
    }
  }

  public bind(): void {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer);
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
