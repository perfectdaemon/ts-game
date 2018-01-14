import { VertexFormat, VertexBufferId, VertexBufferUsage, VertexBufferMapAccess } from "./webgl-types";
import { gl } from "./webgl";

export class VertexBuffer {
  private buffer: WebGLBuffer;

  private _vertexBufferUsage = [
    {
      key: VertexBufferUsage.StaticDraw,
      value: gl.STATIC_DRAW,
    },
  ];

  constructor(
    data: number[],
    public count: number,
    public format: VertexFormat,
    public usage: VertexBufferUsage) {
    
      this.buffer = <WebGLBuffer>gl.createBuffer();
    if (!this.buffer) {
      console.log('Error while creating Vertex Buffer');
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), usage);
  }


  public bind(): void {

  }

  public free(): void {
    gl.deleteBuffer(this.buffer);
  }

  public update(data: any, start: number, count: number): void {

  }

  public map(access: VertexBufferMapAccess = VertexBufferMapAccess.ReadWrite): any {

  }

  public unmap(): void {

  }
}