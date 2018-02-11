export enum TextureWrap { Repeat, ClampToEdge, MirrorRepeat }
export enum TextureFilter { Nearest, Linear }

export enum VertexFormat { Pos2Tex2 = 0, Pos3Tex2, Pos3Tex2Nor3, Pos3Tex2Col4 }
export enum IndexFormat { Byte = 0, Short, Int }

export enum VertexAtrib { vaCoord = 0, vaNormal = 1, vaTexCoord0 = 2, vaTexCoord1 = 3, vaColor = 4 }

export enum BlendingMode { None, Alpha, Additive, Multiply, Screen }
export enum CullMode { None, Back, Front }
export enum FuncComparison { Never, Less, Equal, LessOrEqual, Greater, NotEqual, GreaterOrEqual, Always }
export enum ClearMask { All, Color, Depth }
