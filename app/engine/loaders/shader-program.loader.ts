import { ShaderProgram, ShaderType } from '../render/shader-program';
import { BaseLoader, IRemoteResourceLoader } from './remote-resource.loader';
import { ShaderProgramData } from './shader-program.data';

export class ShaderProgramLoader extends BaseLoader implements IRemoteResourceLoader<ShaderProgram> {
  load(data: ShaderProgramData): Promise<ShaderProgram> {
    return new Promise<ShaderProgram>((resolve: any, reject: any) => {
      const shader = new ShaderProgram();

      shader.attach(ShaderType.Vertex, data.vertexShaderText);
      shader.attach(ShaderType.Fragment, data.fragmentShaderText);
      shader.link();

      resolve(shader);
    });
  }
}
