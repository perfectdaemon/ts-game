import { MenuData } from '../../../engine/helpers/menu/menu-data';
import { Vector2 } from '../../../engine/math/vector2';
import { Vector3 } from '../../../engine/math/vector3';
import { Vector4 } from '../../../engine/math/vector4';

const WIDTH = 960;
const HEIGHT = 768;

export const PLANET_MENU_DATA: MenuData = {
  background: {},
  buttons: [
    {
      name: 'TakeOffButton',
      labelText: 'Взлететь',
      labelColor: new Vector4(1, 1, 1, 1.0),
      labelScale: 1.0,
      size: new Vector2(150, 40),
      position: new Vector3(WIDTH - 150, 35, 1),
      pivotPoint: new Vector2(0.5, 0.5),
      verticesColor: new Vector4(0.8, 0.8, 0.8, 1.0),
      hoverVerticesColor: new Vector4(1.0, 1.0, 1.0, 1.0),
      textureRegion: {
        name: 'button_red.png',
        adjustSize: true,
      },
    },
    {
      name: 'RepairButton',
      labelText: 'Починить',
      labelColor: new Vector4(1, 1, 1, 1.0),
      labelScale: 1.0,
      labelPosition: new Vector2(20, 0),
      labelPivot: new Vector2(0, 0.5),
      size: new Vector2(150, 40),
      position: new Vector3(20, HEIGHT - 45, 2),
      pivotPoint: new Vector2(0, 0.5),
      verticesColor: new Vector4(0.8, 0.8, 0.8, 1.0),
      hoverVerticesColor: new Vector4(1.0, 1.0, 1.0, 1.0),
      textureRegion: {
        name: 'repair_button.png',
        adjustSize: true,
      },
    },
    {
      name: 'BuySellButton',
      labelText: '---',
      labelColor: new Vector4(1, 1, 1, 1.0),
      labelScale: 1.0,
      size: new Vector2(150, 40),
      position: new Vector3(WIDTH - 150, HEIGHT - 35, 1),
      pivotPoint: new Vector2(0.5, 0.5),
      verticesColor: new Vector4(0.8, 0.8, 0.8, 1.0),
      hoverVerticesColor: new Vector4(1.0, 1.0, 1.0, 1.0),
      textureRegion: {
        name: 'button_green.png',
        adjustSize: true,
      },
    },
    {
      name: 'ShipTransferButton',
      labelText: '---',
      labelColor: new Vector4(1, 1, 1, 1.0),
      labelScale: 1.0,
      size: new Vector2(150, 40),
      position: new Vector3(WIDTH - 380, HEIGHT - 35, 1),
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
