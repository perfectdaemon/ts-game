import { AssetLoader } from '../../engine/helpers/asset-loader';

export const SOUNDS = {
  coin: 'coin.wav',
  hit: 'hit.wav',
  shoot: 'shoot.wav',
  powerup: 'powerup.wav',
};

export class AudioManager {
  private context: AudioContext = new AudioContext();
  private sounds: { [key: string]: AudioBuffer } = {};
  private masterVolume: GainNode = this.context.createGain();

  constructor() {
    this.masterVolume.gain.value = 0.3;
    this.masterVolume.connect(this.context.destination);
  }

  loadAll(): Promise<void[]> {
    const promises: Promise<any>[] = [];

    for (const name in SOUNDS) {
      promises.push(this.load((SOUNDS as any)[name]));
    }
    return Promise.all(promises);
  }

  play(name: string): void {
    const source = this.context.createBufferSource();
    source.buffer = this.sounds[name];
    source.connect(this.masterVolume);
    source.start();
  }

  private load(name: string): Promise<AudioBuffer> {
    return AssetLoader.getResponseFromUrl<any>(`assets/${name}`, 'arraybuffer')
      .then(data => this.context.decodeAudioData(data))
      .then(buffer => this.sounds[name] = buffer);
  }
}
