import { VertexFormat, VertexBufferId, VertexBufferUsage, VertexBufferMapAccess, VertexAtrib } from "./webgl-types";
import { gl } from "./webgl";

export class VertexBuffer {
  public buffer: WebGLBuffer;

  constructor(public format: VertexFormat, public count: number) {

    this.buffer = <WebGLBuffer>gl.createBuffer();
    if (!this.buffer) {
      console.log('Error while creating Vertex Buffer');
      return;
    }

    this.bind();
    const size = count * this.getSizeFromFormat(this.format);
    gl.bufferData(gl.ARRAY_BUFFER, size, gl.STATIC_DRAW);
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
    gl.bufferSubData(gl.ARRAY_BUFFER, start, new Float32Array(data));
  }

  private getSizeFromFormat(format: VertexFormat): number {
    switch (format) {
      case VertexFormat.Pos3Tex2: return 20;
      case VertexFormat.Pos2Tex2: return 16;
      case VertexFormat.Pos3Tex2Nor3: return 32;
      case VertexFormat.Pos3Tex2Col4: return 36;
    }
  }
  /*
    public map(access: VertexBufferMapAccess = VertexBufferMapAccess.ReadWrite): any {
      console.log('VertexBuffer.map is not implemented');
      return null;
    }

    public unmap(): void {
      console.log('VertexBuffer.unmap is not implemented');
    }*/
}
