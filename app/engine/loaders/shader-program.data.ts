import { ShaderProgram } from '../render/shader-program';
import { BaseData, IDataFor } from './base.data';

export class ShaderProgramData extends BaseData implements IDataFor<ShaderProgram> {
  vertexShaderText: string = '';
  fragmentShaderText: string = '';
}
