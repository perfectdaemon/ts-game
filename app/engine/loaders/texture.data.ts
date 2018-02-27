import { TextureFilter } from '../render/webgl-types';

export class TextureData {
  imageFileSrc: string = '';
  filter: TextureFilter = TextureFilter.Linear;
  anisotropic: number = 0;
}
