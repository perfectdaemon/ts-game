import { VertexAtrib, ShaderProgramId, ShaderId } from "./webgl-types";

export enum ShaderType { Vertex, Fragment };
export enum UniformType { Vec1, Vec2, Vec3, Vec4, Mat4, Sampler, Int };

export class UniformInfo {
    type: UniformType;
    name: string;
    count: number;
    index: number;
    data: any;
}

export class ShaderProgram {
    private linkStatus: number;

    public program: WebGLProgram;
    public shadersId: ShaderId[];
    public uniforms: UniformInfo[];


    constructor() {

    }

    public free(): void {

    }

    public bind(): void {

    }

    public static unbind(): void {

    }

    public attach(stream: any, shaderType: ShaderType, freeStreamOnFinish: boolean = true): void {

    }

    public link(): void {

    }

    public addUniform(uniformType: UniformType, count: number, name: string, data: any = null): number {
        return 0;
    }
    public getUniformIndexByName(name: string): number {
        return 0;
    }
    /*
    public setUniform(uniformType: UniformType, count: number, value: any, name: string, index: number = -1): void {

    }*/

    public setUniform(internalIndex: number, value: any): void {

    }

    private getVertexAtribName(attribute: VertexAtrib): string {
        return '';
    }
}
