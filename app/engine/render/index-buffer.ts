import { gl } from './webgl';
import { IndexFormat } from './webgl-types';

export class IndexBuffer {
  public static getSizeFromFormat(format: IndexFormat): number {
    switch (format) {
      case IndexFormat.Byte: return 1;
      case IndexFormat.Short: return 2;
      case IndexFormat.Int: return 4;
    }
  }

  public static getWebGLFormat(format: IndexFormat): number {
    switch (format) {
      case IndexFormat.Byte: return gl.UNSIGNED_BYTE;
      case IndexFormat.Short: return gl.UNSIGNED_SHORT;
      case IndexFormat.Int: return gl.UNSIGNED_INT;
    }
  }

  public buffer: WebGLBuffer;

  constructor(public format: IndexFormat, public count: number) {
    this.buffer = gl.createBuffer() as WebGLBuffer;
    if (!this.buffer) {
      console.log('Error while creating Index Buffer');
      return;
    }

    this.bind();
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, count * IndexBuffer.getSizeFromFormat(format), gl.STATIC_DRAW);
  }

  public free(): void {
    gl.deleteBuffer(this.buffer);
  }

  public bind(): void {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
  }

  public update(data: number[], start: number): void {
    this.bind();

    let iData: Uint8Array | Uint16Array | Uint32Array;

    switch (this.format) {
      case IndexFormat.Byte: iData = new Uint8Array(data); break;
      case IndexFormat.Short: iData = new Uint16Array(data); break;
      case IndexFormat.Int: iData = new Uint32Array(data); break;
      default:
        console.log(`IndexBuffer.update() - wrong format: ${this.format}`);
        return;
    }

    gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, start, iData)
  }
}
