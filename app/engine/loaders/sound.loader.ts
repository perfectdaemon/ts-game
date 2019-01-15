import { AssetLoader } from '../helpers/asset-loader';
import { SoundData, SoundLoadedData } from './sound.data';

export class SoundLoader {
  private _audioContext = new AudioContext();
  load(data: SoundData): Promise<SoundLoadedData> {
    return AssetLoader.getResponseFromUrl<any>(data.soundFileSrc, 'arraybuffer')
      .then(arrayData => this._audioContext.decodeAudioData(arrayData))
      .then(decoded => ({ audioBuffer: decoded, soundName: data.soundName }));
  }
}
