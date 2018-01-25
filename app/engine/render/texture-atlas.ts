import { Texture } from "./texture";
import { AssetLoader } from "../helpers/asset-loader";

export class TextureRegion {
  texture: Texture;
  name: string;
  tx: number;
  ty: number;
  tw: number;
  th: number;
  rotated: boolean;
}

export class TextureAtlas extends Texture {

  protected _regions: TextureRegion[] = [];

  constructor(imageFileSrc: string, infoFileId: string) {
    super(imageFileSrc);

    const infodata = AssetLoader.getElementDataOrEmpty(infoFileId);
    console.error(`new TextureAtlas() is not implemented`);
  }

  free(): void {
    super.free();
  }

  getRegion(name: string): TextureRegion {
    const result = this._regions.filter(region => region.name === name);

    if (result.length === 0) {
      console.error(`Can't find region '${name}'`);
    } else if (result.length > 1) {
      console.error(`Too many regions (${result.length}) with name '${name}'`);
    }

    return result[0];
  }
}
