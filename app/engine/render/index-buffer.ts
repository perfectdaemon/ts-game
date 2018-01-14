import { IndexFormat } from "./webgl-types";
import { gl } from "./webgl";

export class IndexBuffer {
  public buffer: WebGLBuffer;

  constructor(public format: IndexFormat, public count: number) {
    this.buffer = <WebGLBuffer>gl.createBuffer();
    if (!this.buffer) {
      console.log('Error while creating Index Buffer');
      return;
    }

    this.bind();
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, count * this.getSizeFromFormat(format), gl.STATIC_DRAW);
  }

  public free(): void {
    gl.deleteBuffer(this.buffer);
  }

  public bind(): void {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
  }

  public update(data: any, start: number): void {
    this.bind();
    gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, start, data)
  }

  private getSizeFromFormat(format: IndexFormat): number {
    switch (format) {
      case IndexFormat.Byte: return 1;
      case IndexFormat.Short: return 2;
      case IndexFormat.Int: return 4;
    }
  }
}
