import { gl, renderer } from './webgl';
import { VertexAtrib } from './webgl-types';

export enum ShaderType { Vertex, Fragment }
export enum UniformType { Vec1, Vec2, Vec3, Vec4, Mat4, Sampler, Int }

export class UniformInfo {
  constructor(
    public type: UniformType,
    public name: string,
    public count: number,
    public index: WebGLUniformLocation,
    public data: () => any = () => null) { }
}

export class ShaderProgram {

  public static unbind(): void {
    gl.useProgram(null);
  }

  public program: WebGLProgram;
  public shaders: WebGLShader[] = [];
  public uniforms: UniformInfo[] = [];

  constructor() {
    this.program = gl.createProgram() as WebGLProgram;
    if (!this.program) {
      console.error('ShaderProgram create failed');
      return;
    }
  }

  public free(): void {
    gl.deleteProgram(this.program);
    this.shaders.forEach(shader => {
      gl.deleteShader(shader);
    });
  }

  public bind(): void {
    gl.useProgram(this.program);

    for (let i = 0; i < this.uniforms.length; ++i) {
      if (!this.uniforms[i].data) {
        continue;
      }
      this.setUniform(i);
    }
  }

  public attach(shaderType: ShaderType, source: string): void {
    const glShaderType = this.getWebGLShaderType(shaderType);
    const shader = gl.createShader(glShaderType) as WebGLShader;

    if (!shader) {
      console.log(`ShaderProgram.attach() failed - can't create shader with type ${glShaderType} (${shaderType})`);
      return;
    }

    this.shaders.push(shader);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log(`ShaderProgram.attach() failed - can't compile ${shaderType} shader
       InfoLog:`);
      const infoLog = gl.getShaderInfoLog(shader);
      console.log(infoLog);
      return;
    }

    if (shaderType === ShaderType.Vertex) {
      // Gets only enum names
      const vertexAttributes = Object.keys(VertexAtrib).filter(key => typeof VertexAtrib[key as any] === 'number');
      for (const attribute in vertexAttributes) {
        gl.bindAttribLocation(this.program, parseInt(attribute), VertexAtrib[attribute]);
      }
    }

    gl.attachShader(this.program, shader);
  }

  public link(): void {

    // Link
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.log(`ShaderProgram.link() failed at link
        InfoLog:`);
      const infoLog = gl.getProgramInfoLog(this.program);
      console.log(infoLog);
    }

    // Validate
    gl.validateProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.VALIDATE_STATUS)) {
      console.log(`ShaderProgram.link() failed at validate
        InfoLog:`);
      const infoLog = gl.getProgramInfoLog(this.program);
      console.log(infoLog);
    }

    // Set shared uniforms
    this.addUniform(UniformType.Mat4, 1, 'uModelViewProj', () => renderer.renderParams.modelViewProjection.e);
    this.addUniform(UniformType.Vec4, 1, 'uColor', () => renderer.renderParams.color.asArray());

    // Cleanup
    this.shaders.forEach(shader => gl.detachShader(this.program, shader));
  }

  public addUniform(uniformType: UniformType, count: number, name: string, data?: () => any): number | null {
    const index = gl.getUniformLocation(this.program, name);

    if (!index) {
      console.log(`ShaderProgram.addUniform failed - gl.getUniformLocation for ${name} returned null (not found)`);
      return null;
    }

    const uniformInfo = new UniformInfo(uniformType, name, count, index, data);
    return this.uniforms.push(uniformInfo);
  }

  public getUniformIndexByName(name: string): WebGLUniformLocation | null {
    return this.uniforms.filter(uniform => uniform.name === name)[0].index || null;
  }
  /*
  public setUniform(uniformType: UniformType, count: number, value: any, name: string, index: number = -1): void {

  }*/

  public setUniform(internalIndex: number, value?: () => any): void {
    const uniform = this.uniforms[internalIndex];

    if (value != null) {
      uniform.data = value;
    }

    switch (uniform.type) {
      case UniformType.Vec1: gl.uniform1fv(uniform.index, uniform.data()); break;
      case UniformType.Vec2: gl.uniform2fv(uniform.index, uniform.data()); break;
      case UniformType.Vec3: gl.uniform3fv(uniform.index, uniform.data()); break;
      case UniformType.Vec4: gl.uniform4fv(uniform.index, uniform.data()); break;
      case UniformType.Mat4: gl.uniformMatrix4fv(uniform.index, false, uniform.data()); break;
      case UniformType.Sampler: gl.uniform1iv(uniform.index, uniform.data()); break;
      case UniformType.Int: gl.uniform1iv(uniform.index, uniform.data()); break;
    }
  }

  public updateUniformValue(name: string, value: () => any): void {
    let index = -1;
    for (let i = 0; i < this.uniforms.length; ++i) {
      if (this.uniforms[i].name === name) {
        index = i;
        break;
      }
    }

    if (index === -1) {
      console.error(`Uniform of name '${name}' was not found`);
      return;
    }

    this.uniforms[index].data = value;
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
