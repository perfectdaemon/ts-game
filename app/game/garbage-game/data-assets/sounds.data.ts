import { SoundData } from '../../../engine/loaders/sound.data';

export const SOUNDS = {
  coin: 'coin',
  hit: 'hit',
  shoot: 'shoot',
  powerup: 'powerup',
};

export const SOUNDS_DATA: SoundData[] = [
  { soundFileSrc: 'assets/coin.wav', soundName: SOUNDS.coin },
  { soundFileSrc: 'assets/hit.wav', soundName: SOUNDS.hit },
  { soundFileSrc: 'assets/shoot.wav', soundName: SOUNDS.shoot },
  { soundFileSrc: 'assets/powerup.wav', soundName: SOUNDS.powerup },
];
