import { Text } from '../../../engine/scene/text';

export class PlayerStatsRow {
  caption: Text;
  value: Text;

  constructor(captionText: string, valueText: string, x: number, y: number, offset: number) {
    this.caption = new Text(captionText);
    this.caption.position.set(x, y, 1);
    this.caption.color.set(1, 1, 1, 1);

    this.value = new Text(valueText);
    this.value.parent = this.caption;
    this.value.position.set(offset, 0, 1);
    this.value.color.set(1, 1, 1, 1);
    this.value.letterSpacing = 1.5;
  }
}
