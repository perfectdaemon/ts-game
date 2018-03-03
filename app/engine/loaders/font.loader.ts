import { AssetLoader } from '../helpers/asset-loader';
import { Font } from '../render/font';
import { SymbolData } from '../render/symbol-data';
import { FontData } from './font.data';

export class FontLoader {
  load(data: FontData): Promise<Font> {
    return new Promise<Font>((resolve, reject) => {
      const font = new Font();

      AssetLoader.getResponseFromUrl<ArrayBuffer>(data.fontFileSrc, 'arraybuffer')
        .then(result => {
          const view = new DataView(result);
          const symbolDatas = [];
          let offset = 0;
          while (offset < view.byteLength) {
            const symbolData = new SymbolData();

            symbolData.symbol = String.fromCharCode(view.getUint16(offset));
            symbolData.startY = view.getUint16(offset + 2);
            symbolData.width = view.getUint16(offset + 4);
            symbolData.height = view.getUint16(offset + 6);
            symbolData.tx = view.getFloat32(offset + 8);
            symbolData.tx = view.getFloat32(offset + 12);
            symbolData.tx = view.getFloat32(offset + 16);
            symbolData.tx = view.getFloat32(offset + 20);

            symbolDatas.push(symbolData);

            offset += 24;

          }
          console.log(symbolDatas);
          resolve(font);
        });
    });
  }
}
