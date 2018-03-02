import { AssetLoader } from '../helpers/asset-loader';
import { SoundData } from './sound.data';

export class SoundLoader {
  private _audioContext = new AudioContext();
  load(data: SoundData): Promise<AudioBuffer> {
    return AssetLoader.getResponseFromUrl<any>(data.soundFileSrc, 'arraybuffer')
      .then(arrayData => this._audioContext.decodeAudioData(arrayData));
  }
}
