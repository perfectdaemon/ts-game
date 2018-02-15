import { AssetLoader } from '../helpers/asset-loader';
import { TextureAtlas } from '../render/texture-atlas';
import { BaseLoader, IRemoteResourceLoader } from './remote-resource.loader';

export class TextureAtlasLoader extends BaseLoader implements IRemoteResourceLoader<TextureAtlas> {
  load(sources: string[]): Promise<TextureAtlas> {
    return new Promise<TextureAtlas>((resolve: any, reject: any) => {
      const texture = new TextureAtlas();

      const image = new Image();
      image.onload = event => {
        texture.loadFromImage(image);
        console.log(`Texture '${sources[0]}' loaded, width: ${image.width}, height: ${image.height}`);
        AssetLoader.getTextFromUrl(sources[1])
          .then(result => {
            texture.loadRegionInfo(result);
            resolve(texture);
          })
          .catch(error => reject(error));
      };
      image.onerror = error => reject(error);

      image.src = sources[0];
    });
  }
}
