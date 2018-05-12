import { InputEvent } from '../input/input-event';
import { GuiElement } from './gui-element';

export type GuiCallback = (element: GuiElement, inputEvent: InputEvent) => void;
