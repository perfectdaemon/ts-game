import { SymbolData } from './engine/render/symbol-data';

export class BitmapFontGenerator {
  private context: CanvasRenderingContext2D;
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
    this.context.fillStyle = '#333';
    this.context.fillRect(0, 0, canvasElement.width, canvasElement.height);
  }

  draw(
    fontSize: number, fontName: string,
    textureWidth: number, textureHeight: number,
    paddingTop: number, paddingRight: number,
  ): void {
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, textureWidth, textureHeight);

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
      const symbolData = new SymbolData();
      symbolData.width = symbolWidth;
      symbolData.startY = 0;
      symbolData.height = fontSize;
      symbolData.symbol = letter;
      symbolData.tx = startX / textureWidth;
      symbolData.ty = startY / textureHeight;
      symbolData.tw = symbolWidth / textureWidth;
      symbolData.th = fontSize / textureHeight;
      this.symbolDatas.push(symbolData);

      this.context.fillText(letter, startX, startY);
      startX += symbolWidth + paddingRight;
    }

    console.log(this.symbolDatas);
    console.log(this.canvasElement.toDataURL('image/png'));
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
bfg.draw(30, 'Arial', 512, 256, 0, 1);
bfg.save(512, 256);
