import { Texture } from '../render/texture';
import { TextureData } from './texture-data';

export class TextureLoader {
  public static load(data: TextureData): Texture {
    const texture = new Texture(data.fileName);

    return texture;
  }
}
