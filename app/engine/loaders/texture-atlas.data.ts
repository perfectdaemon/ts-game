import { TextureAtlas } from '../render/texture-atlas';
import { IDataFor } from './base.data';
import { TextureData } from './texture.data';

export class TextureAtlasData extends TextureData implements IDataFor<TextureAtlas> {
  atlasFileSrc: string = '';
}
