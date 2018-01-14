import { Vector } from "../math/vector";
import { BlendingMode, CullMode, PolygonMode, FuncComparison, ShaderId, TextureId, VertexBufferId, IndexBufferId, FrameBufferId, ClearMask, ShaderProgramId } from 'webgl-types';
import { VertexBuffer } from "./vertex-buffer";
import { IndexBuffer } from "./index-buffer";
import { WebGLRegisterService } from "./webgl";


const TEXTURE_SAMPLERS_MAX = 8;

export class WebGLRenderer {
    public textureBinds: number;
    public triCount: number;
    public dipCount: number;
    public width: number;
    public height: number;

    private _internalVB: VertexBuffer;
    private _internalIB: IndexBuffer;

    private _blendingMode: BlendingMode;
    private _cullMode: CullMode;
    private _polygonMode: PolygonMode;

    private _depthWrite: boolean;
    private _depthTest: boolean;
    private _depthFunc: FuncComparison;

    private _shader: ShaderId;
    private _textureSampler: TextureId[] = new Array<TextureId>(TEXTURE_SAMPLERS_MAX);
    private _activeSampler: number;
    private _vertexBuffer: VertexBufferId;
    private _indexBuffer: IndexBufferId;
    private _frameBuffer: FrameBufferId;

    private _statTextureBind: number
    private _statTriCount: number;
    private _statDIPCount: number;

    private _width: number;
    private _height: number;

    constructor(private canvasElement: HTMLCanvasElement) {
        const glContext = <WebGLRenderingContext>(canvasElement.getContext('webgl') || canvasElement.getContext('experimental-webgl'));
        if (!glContext) {
            console.log("GL initialize failed");
            return;
        }

        WebGLRegisterService.registerWebGLContext(glContext);

        this.initWebGL();
    }

    public resize(width: number, height: number): void {

    }

    public resetStates(): void {

    }

    public resetStatistics(): void {

    }

    public clear(clearMask: ClearMask): void {

    }

    public setClearColorRGB(r: number, g: number, b: number): void {

    }

    public setClearColorVec4(color: Vec4f): void {

    }

    public setClearColorVec3(color: Vec3f): void {

    }

    public setViewPort(left: number, top: number, width: number, height: number): void {

    }

    public setCullMode(cullMode: CullMode): void {

    }

    public setPolygonMode(polygonMode: PolygonMode): void {

    }

    public setBlendingMode(blendingMode: BlendingMode): void {

    }

    public setDepthWrite(enabled: boolean): void {

    }

    public setDepthTest(enabled: boolean): void {
 
    }

    public setDepthFunc(comparison: FuncComparison): void {

    }

    public setVerticalSync(enabled: boolean): void {

    }

    public setShader(shader: ShaderProgramId): void {

    }

    public setTexture(texture: TextureId, sampler: number): void {

    }

    public setVertexBuffer(vertexBuffer: VertexBuffer): void {

    }

    public setIndexBuffer(indexBuffer: IndexBuffer): void {

    }

    public drawTriangles(vertexBuffer: VertexBuffer, indexBuffer: IndexBuffer, startIndex: number, indicesCount: number): void {

    }

    public drawPoints(vertexBuffer: VertexBuffer, start: number, vertCount: number): void {

    }

    /*public drawScreenQuad(aMaterial: Material): void {
        
    }*/

    private initWebGL(): void {

    }

    private createScreenQuad(): void {

    }
}