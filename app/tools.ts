import { SymbolData } from './engine/render/symbol-data';

export class BitmapFontGenerator {
  private context: CanvasRenderingContext2D;

  private letterCanvas: HTMLCanvasElement;
  private letterContext: CanvasRenderingContext2D;
  private text: string = `
 0123456789!@#$%^&*()_+|{}:"<>?-=\[];',./~\`«–»—
abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ
`;

  private symbolDatas: SymbolData[] = [];

  constructor(private canvasElement: HTMLCanvasElement, private fontDropElement: HTMLElement) {
    fontDropElement.ondrop = (event) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];

    };

    this.context = canvasElement.getContext('2d') as CanvasRenderingContext2D;

    this.letterCanvas = document.createElement('canvas');
    this.letterCanvas.width = 256;
    this.letterCanvas.height = 256;
    this.letterContext = this.letterCanvas.getContext('2d') as CanvasRenderingContext2D;
  }

  drawLetterToHiddenCanvas(letter: string, fontSize: number, fontName: string): number[] {
    this.letterContext.clearRect(0, 0, this.letterCanvas.width, this.letterCanvas.height);
    this.letterContext.fillStyle = '#fff';
    this.letterContext.font = `${fontSize}px ${fontName}`;
    const symbolRectWidth = this.letterContext.measureText(letter).width + 5;
    const symbolRectHeight = fontSize * 2;
    this.letterContext.fillText(letter, 5, fontSize + 5);

    const imageData = this.letterContext.getImageData(0, 0, symbolRectWidth, symbolRectHeight);

    return [this.scanRectForTop(imageData) - 5, this.scanRectForBottom(imageData) - 5];
  }

  scanRectForTop(imageData: ImageData): number {
    for (let row = 0; row < imageData.height; ++row) {
      for (let column = 0; column < imageData.width; ++column) {
        const pixel = row * imageData.width * 4 + column * 4;
        if (imageData.data[pixel + 3] > 0) {
          return row;
        }
      }
    }
    return 0;
  }

  scanRectForBottom(imageData: ImageData): number {
    for (let row = imageData.height; row >= 0; --row) {
      for (let column = 0; column < imageData.width; ++column) {
        const pixel = row * imageData.width * 4 + column * 4;
        if (imageData.data[pixel + 3] > 0) {
          return row;
        }
      }
    }
    return 0;
  }

  draw(
    fontSize: number, fontName: string,
    textureWidth: number, textureHeight: number,
    paddingTop: number, paddingRight: number,
  ): void {
    this.context.fillStyle = '#fff';
    this.context.font = `${fontSize}px ${fontName}`;

    let startX = 0;
    let startY = fontSize;
    for (const letter of this.text) {
      const symbolWidth = this.context.measureText(letter).width;
      if (symbolWidth === 0 || letter === '\n') { continue; }
      if (symbolWidth + startX > textureWidth) {
        startY += fontSize + paddingTop;
        startX = 0;
      }
      const tmpTopStartY = this.drawLetterToHiddenCanvas(letter, fontSize, fontName);
      const symbolData = new SymbolData();
      symbolData.width = symbolWidth;
      symbolData.height = tmpTopStartY[1] - tmpTopStartY[0] + 1;
      symbolData.symbol = letter;
      symbolData.startY = tmpTopStartY[0];
      symbolData.tx = startX / textureWidth;
      symbolData.ty = (startY - fontSize + tmpTopStartY[0]) / textureHeight;
      symbolData.tw = symbolData.width / textureWidth;
      symbolData.th = symbolData.height / textureHeight;
      this.symbolDatas.push(symbolData);

      this.context.fillText(letter, startX, startY);
      startX += symbolWidth + paddingRight;
    }
  }

  save(width: number, height: number): void {
    const hiddenCanvas = document.createElement('canvas');
    hiddenCanvas.width = width;
    hiddenCanvas.height = height;

    const context = hiddenCanvas.getContext('2d') as CanvasRenderingContext2D;
    context.drawImage(this.canvasElement, 0, 0, width, height, 0, 0, width, height);

    const base64data = hiddenCanvas.toDataURL();
    const hrefElement = document.getElementById('downloadBitmapLink') as HTMLAnchorElement;
    hrefElement.download = 'font.png';
    hrefElement.href = base64data;

    const hrefDataElement = document.getElementById('downloadSymbolDataLink') as HTMLAnchorElement;
    hrefDataElement.download = 'font.json';
    hrefDataElement.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.symbolDatas));
  }
}

const canvas = document.getElementById('canvas-main') as HTMLCanvasElement;
const fontDropEl = document.getElementById('fontDrop') as HTMLElement;
const bfg = new BitmapFontGenerator(canvas, fontDropEl);
bfg.draw(30, 'Arial', 512, 256, 1, 1);
bfg.save(512, 256);
