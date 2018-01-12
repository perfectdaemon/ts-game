import { Vector } from "../math/vector";
import { } from 'webgl-types';
/*

export class WebGLRenderer {
    private _gl: WebGLRenderingContext;

    private _internalVB: TglrVertexBuffer;
    private _internalIB: TglrIndexBuffer;

    private _blendingMode: TglrBlendingMode;
    private _cullMode: TglrCullMode;
    private _polygonMode: TglrPolygonMode;
    
    private _depthWrite: boolean; 
    private _depthTest: boolean;
    private _depthFunc: TglrFuncComparison;
    
    private _shader: TglrShaderId;
    private _textureSampler: array[0..TEXURE_SAMPLERS_MAX - 1] of TglrTextureId;
    private _activeSampler: number;
    private _vertexBuffer: TglrVertexBufferId;
    private _indexBuffer: TglrIndexBufferId;
    private _frameBuffer: TglrFrameBufferId;

    private _statTextureBind: number
    private _statTriCount: number;
    private _statDIPCount: number;
    
    private _width: number;
    private _height: number;

    


    constructor(private canvasElement: HTMLCanvasElement) {
        this._gl = <WebGLRenderingContext>(canvasElement.getContext('webgl') || canvasElement.getContext('experimental-webgl'));
    }

    
    public clear(): void;
    public Resize(aWidth, aHeight: number): void;
    public ResetStates(): void;
    public ResetStatistics(): void;
    public Clear(aClearMask: TglrClearMask): void;
    public SetClearColor(R, G, B: number): void;
    public SetClearColor(Color: TglrVec4f): void;
    public SetClearColor(Color: TglrVec3f): void;

    public SetViewPort(aLeft, aTop, aWidth, aHeight: number): void;
    public SetCullMode(aCullMode: TglrCullMode): void;
    public SetPolygonMode(aPolygonMode: TglrPolygonMode): void;
    public SetBlendingMode(aBlendingMode: TglrBlendingMode): void;
    public SetDepthWrite(aEnabled: Boolean): void;
    public SetDepthTest(aEnabled: Boolean): void;
    public SetDepthFunc(aComparison: TglrFuncComparison): void;
    public SetVerticalSync(aEnabled: Boolean): void;
    public SetShader(aShader: TglrShaderProgramId): void;
    public SetTexture(aTexture: TglrTextureId; aSampler: number): void;
    public SetVertexBuffer(vBuffer: TglrVertexBuffer): void;
    public SetIndexBuffer(iBuffer: TglrIndexBuffer): void;

    public DrawTriangles(vBuffer: TglrVertexBuffer; iBuffer: TglrIndexBuffer;
      aStartIndex, aIndicesCount: number): void;
    public DrawPoints(vBuffer: TglrVertexBuffer; aStart, aVertCount: number): void;
    public DrawScreenQuad(aMaterial: TglrMaterial): void;

    public textureBinds: number;
    public triCount: number;
    public dipCount: number;
    public width: number;
    public height: number;
    

    private initWebGL(): void {

    }

    private createScreenQuad(): void;
}*/