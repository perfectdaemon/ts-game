import { gl } from './webgl';
import { IndexFormat } from './webgl-types';

export class IndexBuffer {
  static getSizeFromFormat(format: IndexFormat): number {
    switch (format) {
      case IndexFormat.Byte: return 1;
      case IndexFormat.Short: return 2;
      case IndexFormat.Int: return 4;
    }
  }

  static getWebGLFormat(format: IndexFormat): number {
    switch (format) {
      case IndexFormat.Byte: return gl.UNSIGNED_BYTE;
      case IndexFormat.Short: return gl.UNSIGNED_SHORT;
      case IndexFormat.Int: return gl.UNSIGNED_INT;
    }
  }

  buffer: WebGLBuffer;

  private _intArray: Uint8Array | Uint16Array | Uint32Array;

  constructor(public format: IndexFormat, public count: number) {
    this.buffer = gl.createBuffer() as WebGLBuffer;
    if (!this.buffer) {
      throw new Error('Error while creating Index Buffer');
    }

    const size = count * IndexBuffer.getSizeFromFormat(format);

    switch (format) {
      case IndexFormat.Byte: this._intArray = new Uint8Array(count); break;
      case IndexFormat.Short: this._intArray = new Uint16Array(count); break;
      case IndexFormat.Int: this._intArray = new Uint32Array(count); break;
      default: throw new Error(`new IndexBuffer() - wrong index format: ${this.format}`);
    }

    this.bind();
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, size, gl.STATIC_DRAW);
  }

  public free(): void {
    gl.deleteBuffer(this.buffer);
  }

  public bind(): void {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
  }

  public update(data: number[], start: number): void {
    this.bind();

    this._intArray.set(data, start);
    gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, this._intArray);
  }
}
