import { SoundData } from '../../../engine/loaders/sound.data';

export const SOUNDS = {
  explosion: 'explosion',
  pickup: 'pickup',
  select: 'select',
  music: 'music',
};

export const SOUNDS_DATA: SoundData[] = [
  { soundFileSrc: 'assets/sounds/explosion.wav', soundName: SOUNDS.explosion },
  { soundFileSrc: 'assets/sounds/pickup.wav', soundName: SOUNDS.pickup },
  { soundFileSrc: 'assets/sounds/select.wav', soundName: SOUNDS.select },
];

export const MUSIC_DATA: SoundData[] = [
  { soundFileSrc: 'assets/sounds/music.ogg', soundName: SOUNDS.music },
];
