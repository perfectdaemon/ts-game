import { AssetLoader } from '../helpers/asset-loader';
import { Texture } from './texture';

export class TextureRegion {
  public texture: Texture;
  public name: string;
  public tx: number;
  public ty: number;
  public tw: number;
  public th: number;
  public rotated: boolean;
}

export class TextureAtlas extends Texture {

  protected _regions: TextureRegion[] = [];

  constructor(imageFileSrc: string, infoFileId: string) {
    super(imageFileSrc);

    const infodata = AssetLoader.getElementDataOrEmpty(infoFileId);
    console.error(`new TextureAtlas() is not implemented`);
  }

  public free(): void {
    super.free();
  }

  public getRegion(name: string): TextureRegion {
    const result = this._regions.filter(region => region.name === name);

    if (result.length === 0) {
      console.error(`Can't find region '${name}'`);
    } else if (result.length > 1) {
      console.error(`Too many regions (${result.length}) with name '${name}'`);
    }

    return result[0];
  }
}
