export class BitmapFontGenerator {
  private context: CanvasRenderingContext2D;

  constructor(private canvasElement: HTMLCanvasElement, private fontDropElement: HTMLElement) {
    fontDropElement.ondrop = (event) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];

    };

    this.context = canvasElement.getContext('2d') as CanvasRenderingContext2D;
  }
}

const canvas = document.getElementById('canvas-main') as HTMLCanvasElement;
const fontDropEl = document.getElementById('fontDrop') as HTMLElement;
const bfg = new BitmapFontGenerator(canvas, fontDropEl);
