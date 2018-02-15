import { Texture } from '../render/texture';
import { BaseData, IDataFor } from './base.data';

export class TextureData extends BaseData implements IDataFor<Texture> {
  imageFileSrc: string = '';
}
