import { Vector2 } from '../../../engine/math/vector2';
import { Vector3 } from '../../../engine/math/vector3';
import { Vector4 } from '../../../engine/math/vector4';
import { MenuData } from '../menu/menu-data';

const WIDTH = 960;
const HEIGHT = 768;

export const PLANET_DATA: MenuData = {
  background: {},
  buttons: [
    {
      name: "TakeOffButton",
      labelText: 'Взлететь',
      labelColor: new Vector4(0.3, 0.3, 0.3, 1.0),
      labelScale: 1.0,
      size: new Vector2(150, 40),
      position: new Vector3(WIDTH - 100, HEIGHT - 45, 1),
      pivotPoint: new Vector2(0.5, 0.5),
      verticesColor: new Vector4(0.9, 0.8, 0.8, 1.0),
      hoverVerticesColor: new Vector4(1.0, 1.0, 1.0, 1.0),
    },
  ],
};