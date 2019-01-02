import { renderer } from '../../../engine/render/webgl';
import { Sprite } from '../../../engine/scene/sprite';
import { GLOBAL } from '../global';
import { SolarBase } from './solar.base';

export class Player extends SolarBase {
  static buildPlayer(): Player {
    const player = new Player();
    player.initialize();
    player.sprite.position.set(renderer.width / 2.0, renderer.height / 2.0, 5);
    return player;
  }

  initialize(): void {
    super.initialize();
    const playerTextureRegion = GLOBAL.assets.solarAtlas.getRegion('triangle.png');

    this.sprite = new Sprite();
    this.sprite.setTextureRegion(playerTextureRegion, false);
    this.sprite.setSize(16, 16);
  }
}
