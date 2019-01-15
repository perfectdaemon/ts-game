import { LoaderFactory } from '../../../engine/loaders/loader-factory';
import { MaterialData } from '../../../engine/loaders/material.data';
import { Font } from '../../../engine/render/font';
import { Material } from '../../../engine/render/material';
import { ShaderProgram } from '../../../engine/render/shader-program';
import { Texture } from '../../../engine/render/texture';
import { TextureAtlas } from '../../../engine/render/texture-atlas';
import { Camera } from '../../../engine/scene/camera';
import { AudioManager } from '../../../engine/sound/audio-manager';
import { DEFAULT_FONT, DEFAULT_MATERIAL, DEFAULT_SHADER } from './default';
import { MUSIC_DATA, SOUNDS_DATA } from './sound.data';
import { DEFAULT_ATLAS_DATA } from './textures';

export class Assets {
  shader: ShaderProgram;
  blankMaterial: Material;

  solarAtlas: TextureAtlas;
  solarMaterial: Material;

  font: Font;

  gameCamera: Camera;
  guiCamera: Camera;

  audioManager: AudioManager;

  private loaders: LoaderFactory = new LoaderFactory();

  async loadAll(): Promise<void> {
    this.gameCamera = new Camera();
    this.guiCamera = new Camera();

    const soundLoading = this.loadSounds();

    this.shader = await this.loaders.loadShaderProgram(DEFAULT_SHADER);
    DEFAULT_MATERIAL.shaderProgram = this.shader;

    DEFAULT_MATERIAL.textures[0].texture = new Texture();
    (DEFAULT_FONT.materialData as MaterialData).shaderProgram = this.shader;
    this.blankMaterial = await this.loaders.loadMaterial(DEFAULT_MATERIAL);
    this.font = await this.loaders.loadFont(DEFAULT_FONT);

    this.solarAtlas = await this.loaders.loadTextureAtlas(DEFAULT_ATLAS_DATA);

    DEFAULT_MATERIAL.textures[0].texture = undefined;
    DEFAULT_MATERIAL.textures[0].textureAtlas = this.solarAtlas;
    this.solarMaterial = await this.loaders.loadMaterial(DEFAULT_MATERIAL);

    await soundLoading;

    return Promise.resolve();
  }

  private async loadSounds(): Promise<void> {
    this.audioManager = new AudioManager();

    const loadedSounds = await this.loaders.loadSounds(SOUNDS_DATA);
    for (const sound of loadedSounds) {
      this.audioManager.addSound(sound.audioBuffer, sound.soundName);
    }

    const loadedMusic = await this.loaders.loadSounds(MUSIC_DATA);

    for (const music of loadedMusic) {
      this.audioManager.addMusic(music.audioBuffer, music.soundName);
    }

    return Promise.resolve();
  }
}
