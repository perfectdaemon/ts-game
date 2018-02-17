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

const LINE_REGEXP = /(.*?)\t(\d*?)\t(\d*?)\t(\d*?)\t(\d*?)\t(\d*?)\t(\d*?)\t(\d*?)\t(\d*?)\t([r]?)/;

export class TextureAtlas extends Texture {

  protected _regions: TextureRegion[] = [];

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

  public loadRegionInfo(infoData: string): void {
    const lines = infoData.split('\n').slice(1);

    for (const line of lines) {
      if (!line || line.length === 0) {
        continue;
      }

      const match = LINE_REGEXP.exec(line);
      if (!match) {
        console.error(`TextureAtlas - can't parse line '${line}'`);
        continue;
      }

      this._regions.push({
        texture: this,
        name: match[1],
        tx: parseInt(match[2]) / this.width,
        ty: parseInt(match[3]) / this.height,
        tw: parseInt(match[4]) / this.width,
        th: parseInt(match[5]) / this.height,
        rotated: (match.length > 10 && match[10] === 'r'),
      });
    }
  }
}
