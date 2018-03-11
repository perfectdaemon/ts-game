import { gl } from './webgl';
import { VertexAtrib, VertexFormat } from './webgl-types';

export class VertexBuffer {
  private _floatArray: Float32Array;
  public buffer: WebGLBuffer;

  constructor(public format: VertexFormat, public count: number) {

    this.buffer = gl.createBuffer() as WebGLBuffer;
    if (!this.buffer) {
      console.log('Error while creating Vertex Buffer');
      return;
    }

    this.bind();
    const size = count * this.getSizeFromFormat(this.format);
    gl.bufferData(gl.ARRAY_BUFFER, size, gl.STATIC_DRAW);
    this._floatArray = new Float32Array(count * this.getFloatCountFromFormat(this.format));
  }

  public bind(): void {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    const size = this.getSizeFromFormat(this.format);

    switch (this.format) {
      case VertexFormat.Pos3Tex2:
        gl.enableVertexAttribArray(VertexAtrib.vaCoord);
        gl.enableVertexAttribArray(VertexAtrib.vaTexCoord0);
        gl.vertexAttribPointer(VertexAtrib.vaCoord, 3, gl.FLOAT, false, size, 0);
        gl.vertexAttribPointer(VertexAtrib.vaTexCoord0, 2, gl.FLOAT, false, size, 12);
        break;

      case VertexFormat.Pos2Tex2:
        gl.enableVertexAttribArray(VertexAtrib.vaCoord);
        gl.enableVertexAttribArray(VertexAtrib.vaTexCoord0);
        gl.vertexAttribPointer(VertexAtrib.vaCoord, 2, gl.FLOAT, false, size, 0);
        gl.vertexAttribPointer(VertexAtrib.vaTexCoord0, 2, gl.FLOAT, false, size, 8);
        break;

      case VertexFormat.Pos3Tex2Nor3:
        gl.enableVertexAttribArray(VertexAtrib.vaCoord);
        gl.enableVertexAttribArray(VertexAtrib.vaTexCoord0);
        gl.enableVertexAttribArray(VertexAtrib.vaNormal);
        gl.vertexAttribPointer(VertexAtrib.vaCoord, 3, gl.FLOAT, false, size, 0);
        gl.vertexAttribPointer(VertexAtrib.vaTexCoord0, 2, gl.FLOAT, false, size, 12);
        gl.vertexAttribPointer(VertexAtrib.vaNormal, 3, gl.FLOAT, false, size, 20);
        break;

      case VertexFormat.Pos3Tex2Col4:
        gl.enableVertexAttribArray(VertexAtrib.vaCoord);
        gl.enableVertexAttribArray(VertexAtrib.vaTexCoord0);
        gl.enableVertexAttribArray(VertexAtrib.vaColor);
        gl.vertexAttribPointer(VertexAtrib.vaCoord, 3, gl.FLOAT, false, size, 0);
        gl.vertexAttribPointer(VertexAtrib.vaTexCoord0, 2, gl.FLOAT, false, size, 12);
        gl.vertexAttribPointer(VertexAtrib.vaColor, 4, gl.FLOAT, false, size, 20);
        break;
    }
  }

  public free(): void {
    gl.deleteBuffer(this.buffer);
  }

  public update(data: number[], start: number): void {
    this.bind();
    this._floatArray.set(data, start);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._floatArray);
  }

  private getSizeFromFormat(format: VertexFormat): number {
    return this.getFloatCountFromFormat(format) * 4;
  }

  private getFloatCountFromFormat(format: VertexFormat): number {
    switch (format) {
      case VertexFormat.Pos3Tex2: return 5;
      case VertexFormat.Pos2Tex2: return 4;
      case VertexFormat.Pos3Tex2Nor3: return 8;
      case VertexFormat.Pos3Tex2Col4: return 9;
    }
  }
}
