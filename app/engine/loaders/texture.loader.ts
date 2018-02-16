import { Texture } from '../render/texture';
import { BaseLoader, IRemoteResourceLoader } from './remote-resource.loader';
import { TextureData } from './texture.data';

export class TextureLoader extends BaseLoader implements IRemoteResourceLoader<Texture> {
  load(data: TextureData): Promise<Texture> {
    return new Promise<Texture>((resolve: any, reject: any) => {
      const texture = new Texture();

      const image = new Image();
      image.onload = event => {
        texture.loadFromImage(image);
        console.log(`Texture '${data.imageFileSrc}' loaded, width: ${image.width}, height: ${image.height}`);
        resolve(texture);
      };
      image.onerror = error => reject(error);

      image.src = data.imageFileSrc;
    });
  }
}
