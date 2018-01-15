import { Vector2, Vector3 } from "../math/vector";
import { Vector4 } from "../math/vector4";

export type TextureId = number;
export type ShaderProgramId = number;
export type ShaderId = number;
export type IndexBufferId = number;
export type VertexBufferId = number;
export type FrameBufferId = number;
export type Index = number;


export enum TextureFormat { RGB8, RGBA8, BGR8, BGRA8 };
export enum VertexFormat { Pos2Tex2 = 0, Pos3Tex2, Pos3Tex2Nor3, Pos3Tex2Col4 };
export enum IndexFormat { Byte = 0, Short, Int };

export enum VertexAtrib { vaCoord = 0, vaNormal = 1, vaTexCoord0 = 2, vaTexCoord1 = 3, vaColor = 4 };
export enum VertexBufferMapAccess { Read, Write, ReadWrite };
export enum VertexBufferUsage {
  StreamDraw, StreamRead, StreamCopy,
  StaticDraw, StaticRead, StaticCopy,
  DynamicDraw, DynamicRead, DynamicCopy
};

export enum BlendingMode { None, Alpha, Additive, Multiply, Screen };
export enum CullMode { None, Back, Front };
export enum FuncComparison { Never, Less, Equal, LessOrEqual, Greater, NotEqual, GreaterOrEqual, Always };
export enum ClearMask { All, Color, Depth };

export class VertexP2T2 {
  vec: Vector2;
  tex: Vector2;
}

export class VertexP3T2 {
  vec: Vector3;
  tex: Vector2;
}

export class VertexP3T2C4 {
  vec: Vector3;
  tex: Vector2;
  col: Vector4;
}

export class QuadP3T2C4 {
  vertices: VertexP3T2C4[] = new Array<VertexP3T2C4>(4)
}
