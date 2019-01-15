import { Vector2 } from '../../../engine/math/vector2';
import { Vector3 } from '../../../engine/math/vector3';
import { Vector4 } from '../../../engine/math/vector4';
import { MenuData } from '../menu/menu-data';

const SCREEN_CENTER_X = 480;
const BUTTON_START_Y = 400;

export const MAIN_MENU_DATA: MenuData = {
  background: {},
  buttons: [
    {
      name: 'StartButton',
      labelText: 'Начать игру',
      labelColor: new Vector4(1, 1, 1, 1),
      labelScale: 1.0,
      size: new Vector2(250, 40),
      position: new Vector3(SCREEN_CENTER_X, BUTTON_START_Y, 1),
      pivotPoint: new Vector2(0.5, 0.5),
      verticesColor: new Vector4(0.9, 0.8, 0.8, 1.0),
      hoverVerticesColor: new Vector4(1.0, 1.0, 1.0, 1.0),
      textureRegion: {
        name: 'button_green.png',
        adjustSize: true,
      },
    },

    {
      name: 'MusicButton',
      labelText: 'Музыка вкл.',
      labelColor: new Vector4(1, 1, 1, 1),
      labelScale: 1.0,
      size: new Vector2(250, 40),
      position: new Vector3(SCREEN_CENTER_X, BUTTON_START_Y + 75, 1),
      pivotPoint: new Vector2(0.5, 0.5),
      verticesColor: new Vector4(0.9, 0.8, 0.8, 1.0),
      hoverVerticesColor: new Vector4(1.0, 1.0, 1.0, 1.0),
      textureRegion: {
        name: 'button_green.png',
        adjustSize: true,
      },
    },
  ],
};
