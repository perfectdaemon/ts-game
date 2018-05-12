import { Observable } from '../helpers/event/observable';
import { Vector2 } from '../math/vector2';
import { InputEvent } from './input-event';
import { InputType } from './input-type.enum';
import { Touch } from './touch';

export class Input {
  touches: Touch[] = [
    new Touch(), new Touch(), new Touch(), new Touch(), new Touch(),
    new Touch(), new Touch(), new Touch(), new Touch(), new Touch(),
  ];
  mousePos: Vector2 = new Vector2(0, 0);
  isKeyDown: boolean[] = new Array<boolean>(256);
  lastWheelDelta: number = 0;

  events = new Observable<InputEvent>();

  process(event: InputEvent) {
    const keyCode = event.key as number;

    switch (event.inputType) {
      case InputType.TouchDown:
        this.touches[keyCode].isDown = true;
        this.touches[keyCode].start.set(event.x, event.y);
        this.touches[keyCode].current.set(event.x, event.y);
        break;

      case InputType.TouchUp:
        this.touches[keyCode].isDown = false;
        break;

      case InputType.TouchMove:
        this.touches[keyCode].current.set(event.x, event.y);
        this.mousePos.set(event.x, event.y);
        break;

      case InputType.KeyDown:
        this.isKeyDown[keyCode] = true;
        break;

      case InputType.KeyUp:
        this.isKeyDown[keyCode] = false;
        break;

      case InputType.Wheel:
        this.lastWheelDelta = event.w;
        break;
    }

    this.events.next(event);
  }
}

export const INPUT: Input = new Input();
