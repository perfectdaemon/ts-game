import { VertexAtrib, ShaderProgramId, ShaderId } from "./webgl-types";
import { gl } from "./webgl";

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
  public shaders: WebGLShader[] = [];
  public uniforms: UniformInfo[] = [];


  constructor() {
    this.program = <WebGLProgram>gl.createProgram();
    if (!this.program) {
      console.log('Shader Program create failed');
      return;
    }

  }

  public free(): void {
    gl.deleteProgram(this.program);
  }

  public bind(): void {
    Render.SetShader(Self.Id);

    for i := 0 to Length(Uniforms) - 1 do
      if Uniforms[i].fData <> nil then
          SetUniform(i, Uniforms[i].fData);
  }

  public static unbind(): void {
    Render.SetShader(0);
  }

  public attach(source: string, shaderType: ShaderType, freeStreamOnFinish: boolean = true): void {
    const glShaderType = this.getWebGLShaderType(shaderType);
    const shader = <WebGLShader>gl.createShader(glShaderType);

    if (!shader) {
      console.log(`ShaderProgram.attach failed - can't create shader with type ${glShaderType} (${shaderType})`);
      return;
    }

    this.shaders.push(shader);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log(`ShaderProgram.attach failed - can't compile shader
       InfoLog:`);
      const infoLog = gl.getShaderInfoLog(shader);
      console.log(infoLog);
      return;
    }

    if (shaderType === ShaderType.Vertex) {
      for (let attribute in VertexAtrib) {
        gl.bindAttribLocation()
      }
    }

    gl.attachShader(this.program, shader);

    if (aShaderType = stVertex) then
    for v := Low(TglrVertexAtrib) to High(TglrVertexAtrib) do
      gl.BindAttribLocation(Self.Id, Ord(v), PAnsiChar(GetVertexAtribName(v)));

  gl.AttachShader(Self.Id, ShadersId[i]);
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
    switch (att)
  }

  private getWebGLShaderType(shaderType: ShaderType): number {
    switch (shaderType) {
      case ShaderType.Vertex: return gl.VERTEX_SHADER;
      case ShaderType.Fragment: return gl.FRAGMENT_SHADER;
      default:
        console.log(`Unknown ShaderType: ${shaderType} at ShaderProgram.getWebGLShaderType()`);
        return 0;
    }
  }
}
