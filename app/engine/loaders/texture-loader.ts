import { Texture } from '../render/texture';
import { IRemoteResourceLoader } from './i-remote-resource-loader';

export class TextureLoader implements IRemoteResourceLoader<Texture> {
  load(sources: string[]): Promise<Texture> {
    return new Promise<Texture>((resolve: any, reject: any) => {
      const texture = new Texture();

      const image = new Image();
      image.onload = event => {
        texture.loadFromImage(image);
        console.log(`Texture '${sources[0]}' loaded, width: ${image.width}, height: ${image.height}`);
        resolve(texture);
      };
      image.onerror = error => reject(error);

      image.src = sources[0];
    });
  }
}
