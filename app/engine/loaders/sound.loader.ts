import { AssetLoader } from '../helpers/asset-loader';
import { SoundData } from './sound.data';

export class SoundLoader {
  load(data: SoundData): Promise<any> {
    return AssetLoader.getResponseFromUrl<any>(data.soundFileSrc, 'arraybuffer');
  }
}
