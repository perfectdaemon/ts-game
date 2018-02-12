import { ShaderProgram, ShaderType } from '../render/shader-program';
import { ShaderProgramData } from './shader-program-data';

export class ShaderProgramLoader {
  public static load(data: ShaderProgramData): ShaderProgram {
    const shader = new ShaderProgram();

    shader.attach(ShaderType.Vertex, data.vertexShaderText);
    shader.attach(ShaderType.Fragment, data.fragmentShaderText);
    shader.link();

    return shader;
  }
}
