import { VertexFormat, VertexBufferId, VertexBufferUsage, VertexBufferMapAccess, VertexAtrib } from "./webgl-types";
import { gl } from "./webgl";

/**
 * Вершинный буфер
 */
export class VertexBuffer {
  public buffer: WebGLBuffer;

  constructor(public format: VertexFormat) {

    this.buffer = <WebGLBuffer>gl.createBuffer();
    if (!this.buffer) {
      console.log('Error while creating Vertex Buffer');
      return;
    }

    this.bind();
    gl.bufferData(gl.ARRAY_BUFFER, 65535, gl.STATIC_DRAW);
  }

  public bind(): void {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    switch (this.format) {
      case VertexFormat.Pos3Tex2:
        gl.enableVertexAttribArray(VertexAtrib.vaCoord);
        gl.enableVertexAttribArray(VertexAtrib.vaTexCoord0);
        gl.vertexAttribPointer(VertexAtrib.vaCoord, 3, gl.FLOAT, false, 20, 0);
        gl.vertexAttribPointer(VertexAtrib.vaTexCoord0, 2, gl.FLOAT, false, 20, 12);
        break;

      case VertexFormat.Pos2Tex2:
        gl.enableVertexAttribArray(VertexAtrib.vaCoord);
        gl.enableVertexAttribArray(VertexAtrib.vaTexCoord0);
        gl.vertexAttribPointer(VertexAtrib.vaCoord, 2, gl.FLOAT, false, 16, 0);
        gl.vertexAttribPointer(VertexAtrib.vaTexCoord0, 2, gl.FLOAT, false, 16, 8);
        break;

      case VertexFormat.Pos3Tex2Nor3:
        gl.enableVertexAttribArray(VertexAtrib.vaCoord);
        gl.enableVertexAttribArray(VertexAtrib.vaTexCoord0);
        gl.enableVertexAttribArray(VertexAtrib.vaNormal);
        gl.vertexAttribPointer(VertexAtrib.vaCoord, 3, gl.FLOAT, false, 32, 0);
        gl.vertexAttribPointer(VertexAtrib.vaTexCoord0, 2, gl.FLOAT, false, 32, 12);
        gl.vertexAttribPointer(VertexAtrib.vaNormal, 3, gl.FLOAT, false, 32, 20);
        break;

      case VertexFormat.Pos3Tex2Col4:
        gl.enableVertexAttribArray(VertexAtrib.vaCoord);
        gl.enableVertexAttribArray(VertexAtrib.vaTexCoord0);
        gl.enableVertexAttribArray(VertexAtrib.vaColor);
        gl.vertexAttribPointer(VertexAtrib.vaCoord, 3, gl.FLOAT, false, 36, 0);
        gl.vertexAttribPointer(VertexAtrib.vaTexCoord0, 2, gl.FLOAT, false, 36, 12);
        gl.vertexAttribPointer(VertexAtrib.vaColor, 4, gl.FLOAT, false, 36, 20);
        break;
    }
  }

  public free(): void {
    gl.deleteBuffer(this.buffer);
  }

  public update(data: any, start: number): void {
    this.bind();
    gl.bufferSubData(gl.ARRAY_BUFFER, start, data);
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