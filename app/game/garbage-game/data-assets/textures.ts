import { TextureAtlasData } from '../../../engine/loaders/texture-atlas.data';
import { TextureData } from '../../../engine/loaders/texture.data';
import { TextureFilter } from '../../../engine/render/webgl-types';

export const DEFAULT_ATLAS_DATA: TextureAtlasData = {
  imageFileSrc: 'assets/atlas.png',
  atlasFileSrc: 'assets/atlas.atlas',
  filter: TextureFilter.Nearest,
  anisotropic: 0,
};

export const CHARACTER_TEXTURE_DATE: TextureData = {
  imageFileSrc: 'assets/character.png',
  filter: TextureFilter.Nearest,
  anisotropic: 0,
};
