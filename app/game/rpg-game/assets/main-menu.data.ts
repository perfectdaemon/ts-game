import { Vector2 } from '../../../engine/math/vector2';
import { Vector3 } from '../../../engine/math/vector3';
import { Vector4 } from '../../../engine/math/vector4';

const SCREEN_CENTER_X = 480;
const BUTTON_START_Y = 400;
const BUTTON_MARGIN_Y = 60;

export const MAIN_MENU_DATA = {
  background: {},
  buttons: [
    {
      name: "StartButton",
      labelText: 'Start',
      labelColor: new Vector4(0.3, 0.3, 0.3, 1.0),
      labelScale: 1.0,
      size: new Vector2(150, 40),
      position: new Vector3(SCREEN_CENTER_X, BUTTON_START_Y, 1),
      verticesColor: new Vector4(0.9, 0.9, 0.9, 1.0),
      hoverVerticesColor: new Vector4(1.0, 1.0, 1.0, 1.0),
    },

    {
      name: "HelpButton",
      labelText: 'Help',
      labelColor: new Vector4(0.3, 0.3, 0.3, 1.0),
      labelScale: 1.0,
      size: new Vector2(150, 40),
      position: new Vector3(SCREEN_CENTER_X, BUTTON_START_Y + BUTTON_MARGIN_Y, 1),
      verticesColor: new Vector4(0.9, 0.9, 0.9, 1.0),
      hoverVerticesColor: new Vector4(1.0, 1.0, 1.0, 1.0),
    },
  ],
};
