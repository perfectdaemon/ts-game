import { AssetLoader } from '../helpers/asset-loader';
import { Font } from '../render/font';
import { SymbolData } from '../render/symbol-data';
import { FontData } from './font.data';
import { MaterialLoader } from './material.loader';
import { ShaderProgramLoader } from './shader-program.loader';
import { TextureAtlasLoader } from './texture-atlas.loader';
import { TextureLoader } from './texture.loader';

export class FontLoader {
  load(
    data: FontData,
    materialLoader: MaterialLoader,
    shaderProgramLoader: ShaderProgramLoader,
    textureLoader: TextureLoader,
    textureAtlasLoader: TextureAtlasLoader,
  ): Promise<Font> {
    return new Promise<Font>((resolve, reject) => {
      const font = new Font();
      AssetLoader.getResponseFromUrl<SymbolData[]>(data.fontFileSrc, 'json')
        .then(symbols => {
          for (const symbol of symbols) {
            font.fontData[symbol.symbol] = symbol;
            if (symbol.height > font.maxSymbolHeight) {
              font.maxSymbolHeight = symbol.height;
            }
          }

          if (data.material) {
            font.material = data.material;
            resolve(font);
          } else if (data.materialData) {
            materialLoader.load(data.materialData, shaderProgramLoader, textureLoader, textureAtlasLoader)
              .then(material => font.material = material)
              .then(() => resolve(font));
          }
        });
    });
  }
}
