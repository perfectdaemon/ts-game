import { Vector2 } from '../../../engine/math/vector2';
import { Vector3 } from '../../../engine/math/vector3';
import { Vector4 } from '../../../engine/math/vector4';
import { MenuData } from '../menu/menu-data';

const WIDTH = 960;
const HEIGHT = 768;

export const TREASURE_MENU_DATA: MenuData = {
  background: {},
  buttons: [
    {
      name: 'ExitButton',
      labelText: 'Выйти',
      labelColor: new Vector4(1, 1, 1, 1.0),
      labelScale: 1.0,
      size: new Vector2(150, 40),
      position: new Vector3(WIDTH - 120, 470, 1),
      pivotPoint: new Vector2(0.5, 0.5),
      verticesColor: new Vector4(0.8, 0.8, 0.8, 1.0),
      hoverVerticesColor: new Vector4(1.0, 1.0, 1.0, 1.0),
      textureRegion: {
        name: 'button_red.png',
        adjustSize: true,
      },
    },
    {
      name: 'TakeAllButton',
      labelText: 'Взять все',
      labelColor: new Vector4(1, 1, 1, 1.0),
      labelScale: 1.0,
      size: new Vector2(150, 40),
      position: new Vector3(380, 470, 1),
      pivotPoint: new Vector2(0.5, 0.5),
      verticesColor: new Vector4(0.8, 0.8, 0.8, 1.0),
      hoverVerticesColor: new Vector4(1.0, 1.0, 1.0, 1.0),
      textureRegion: {
        name: 'button_green.png',
        adjustSize: true,
      },
    },
    {
      name: 'DropButton',
      labelText: 'Выбросить',
      labelColor: new Vector4(1, 1, 1, 1.0),
      labelScale: 1.0,
      size: new Vector2(150, 40),
      position: new Vector3(130, 470, 1),
      pivotPoint: new Vector2(0.5, 0.5),
      verticesColor: new Vector4(0.8, 0.8, 0.8, 1.0),
      hoverVerticesColor: new Vector4(1.0, 1.0, 1.0, 1.0),
      textureRegion: {
        name: 'button_red.png',
        adjustSize: true,
      },
    },
    {
      name: 'TakeButton',
      labelText: 'Взять',
      labelColor: new Vector4(1, 1, 1, 1.0),
      labelScale: 1.0,
      size: new Vector2(150, 40),
      position: new Vector3(130, 470, 1),
      pivotPoint: new Vector2(0.5, 0.5),
      verticesColor: new Vector4(0.8, 0.8, 0.8, 1.0),
      hoverVerticesColor: new Vector4(1.0, 1.0, 1.0, 1.0),
      textureRegion: {
        name: 'button_green.png',
        adjustSize: true,
      },
    },
  ],
};
