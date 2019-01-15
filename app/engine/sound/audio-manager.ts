export class AudioManager {
  private _context: AudioContext = new AudioContext();
  private _sounds: { [key: string]: AudioBuffer } = {};
  private _music: { [key: string]: AudioBuffer } = {};
  private _masterVolume: GainNode = this._context.createGain();
  private _soundVolume: GainNode = this._context.createGain();
  private _musicVolume: GainNode = this._context.createGain();
  private _musicPlaying: AudioBufferSourceNode | undefined;

  constructor() {
    this._masterVolume.gain.value = 0.3;
    this._masterVolume.connect(this._context.destination);

    this._soundVolume.connect(this._masterVolume);
    this._musicVolume.connect(this._masterVolume);
  }

  get masterVolume(): number {
    return this._masterVolume.gain.value;
  }

  set masterVolume(value: number) {
    this._masterVolume.gain.value = value;
  }

  get soundVolume(): number {
    return this._soundVolume.gain.value;
  }

  set soundVolume(value: number) {
    this._soundVolume.gain.value = value;
  }

  get musicVolume(): number {
    return this._musicVolume.gain.value;
  }

  set musicVolume(value: number) {
    this._musicVolume.gain.value = value;
  }

  addSound(audioBuffer: AudioBuffer, soundName: string): void {
    this._sounds[soundName] = audioBuffer;
  }

  playSound(soundName: string): void {
    const source = this._context.createBufferSource();
    source.buffer = this._sounds[soundName];
    source.connect(this._soundVolume);
    source.start();
  }

  addMusic(audioBuffer: AudioBuffer, musicName: string): void {
    this._music[musicName] = audioBuffer;
  }

  playMusic(musicName: string): void {
    this._musicPlaying = this._context.createBufferSource();
    this._musicPlaying.buffer = this._music[musicName];
    this._musicPlaying.connect(this._musicVolume);
    this._musicPlaying.loop = true;
    this._musicPlaying.start();
  }

  stopMusic(): void {
    if (!this._musicPlaying) {
      return;
    }

    this._musicPlaying.stop();
  }
}
