export type TextureId = number;
export type ShaderProgramId = number;
export type ShaderId = number;
export type IndexBufferId = number;
export type VertexBufferId = number;
export type FrameBufferId = number;
export type Index = number;


export enum TextureFormat { RGB8, RGBA8, BGR8, BGRA8 };
export enum VertexFormat { Pos2Tex2 = 0, Pos3Tex2, Pos3Tex2Nor3, Pos3Tex2Col4 };
export enum IndexFormat { Byte = 0, Short, ifInt };

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
export enum PolygonMode { Fill, Lines, Points };

/*
  TglrVertexP2T2 = record
    vec, tex: TglrVec2f;
  end;

  TglrVertexP3T2 = record
    vec: TglrVec3f;
    tex: TglrVec2f;
  end;

  TglrVertexP3T2N3 = record
    vec: TglrVec3f;
    tex: TglrVec2f;
    nor: TglrVec3f;
  end;
  TglrVertexP3T2N3List = TglrList<TglrVertexP3T2N3>;

  TglrVertexP3T2C4 = record
    vec: TglrVec3f;
    tex: TglrVec2f;
    col: TglrVec4f;
  end;

  TglrQuadP3T2C4 = array[0..3] of TglrVertexP3T2C4;

const VF_STRIDE: [{
    [key: VertexFormat]: number
}] = [

]
array[Low(TglrVertexFormat)..High(TglrVertexFormat)] of Integer =
    (SizeOf(TglrVertexP2T2), SizeOf(TglrVertexP3T2), SizeOf(TglrVertexP3T2N3), SizeOf(TglrVertexP3T2C4));

  IF_STRIDE: array[Low(TglrIndexFormat)..High(TglrIndexFormat)] of Integer =
    (SizeOf(Byte), SizeOf(Word), SizeOf(LongWord));
*/
