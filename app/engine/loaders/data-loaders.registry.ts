import { IDataFor } from './base.data';
import { MaterialLoader } from './material.loader';
import { BaseLoader } from './remote-resource.loader';
import { ShaderProgramLoader } from './shader-program.loader';
import { TextureAtlasLoader } from './texture-atlas.loader';
import { TextureLoader } from './texture.loader';

const registry: { data: string, loader: BaseLoader }[] = [
  { data: 'TextureData', loader: new TextureLoader() },
  { data: 'TextureAtlasData', loader: new TextureAtlasLoader() },
  { data: 'ShaderProgramData', loader: new ShaderProgramLoader() },
  { data: 'MaterialData', loader: new MaterialLoader() },
];

export function loadData<T>(data: IDataFor<T>): Promise<T> {
  const typeName = typeof data;
  const results = registry.filter(reg => reg.data === typeName);
  if (results.length === 0) {
    throw new Error(`Can't find appropriate loader for '${typeName}'`);
  }

  return results[0].loader.load(data);
}
