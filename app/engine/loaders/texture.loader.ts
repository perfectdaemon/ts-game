import { Texture } from '../render/texture';
import { TextureData } from './texture.data';

export class TextureLoader {
  load(data: TextureData): Promise<Texture> {
    return new Promise<Texture>((resolve: any, reject: any) => {
      const texture = new Texture();

      const image = new Image();
      image.onload = event => {
        texture.loadFromImage(image);
        texture.setFilter(data.filter);
        if (data.anisotropic > 0) {
          texture.trySetAnisotropic(data.anisotropic);
        }
        console.log(`Texture '${data.imageFileSrc}' loaded, width: ${image.width}, height: ${image.height}`);

        resolve(texture);
      };
      image.onerror = error => reject(error);

      image.src = data.imageFileSrc;
    });
  }
}
