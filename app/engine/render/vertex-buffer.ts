import { VertexFormat, VertexBufferId, VertexBufferUsage, VertexBufferMapAccess } from "./webgl-types";
import { gl } from "./webgl";

export class VertexBuffer {
  public id: VertexBufferId;

  private buffer: WebGLBuffer | null;
/*
  private _vertexBufferUsage = [
    VertexBufferUsage.StaticDraw: gl.STATIC_DRAW,

  ];*/

  constructor(
    data: number[],
    public count: number,
    public format: VertexFormat,
    public usage: VertexBufferUsage) {
      this.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), usage)
  }


  public bind(): void {

  }


  public free(): void {

  }

  public update(data: any, start: number, count: number): void {

  }

  public map(access: VertexBufferMapAccess = VertexBufferMapAccess.ReadWrite): any {

  }

  public unmap(): void {

  }
}