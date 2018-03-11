import { SymbolData } from '../../engine/render/symbol-data';

export class BitmapFontGenerator {
  private context: CanvasRenderingContext2D;

  private letterCanvas: HTMLCanvasElement;
  private letterContext: CanvasRenderingContext2D;

  private symbolDatas: SymbolData[] = [];
  private textureWidth: number = 0;
  private textureHeight: number = 0;

  constructor(private canvasElement: HTMLCanvasElement) {
    canvasElement.ondrop = (event) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      // todo
    };

    this.context = canvasElement.getContext('2d') as CanvasRenderingContext2D;

    this.letterCanvas = document.createElement('canvas');
    this.letterCanvas.width = 256;
    this.letterCanvas.height = 256;
    this.letterContext = this.letterCanvas.getContext('2d') as CanvasRenderingContext2D;
  }

  draw(
    text: string,
    fontSize: number, fontName: string,
    textureWidth: number, textureHeight: number,
    paddingTop: number, paddingRight: number,
  ): void {
    this.context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.context.strokeStyle = '#0ff';
    this.context.strokeRect(-1, -1, textureWidth + 1, textureHeight + 1);

    this.symbolDatas = [];
    this.textureWidth = textureWidth;
    this.textureHeight = textureHeight;

    this.context.fillStyle = '#fff';
    this.context.font = `${fontSize}px ${fontName}`;

    let startX = 0;
    let startY = fontSize;
    for (const letter of text) {
      const symbolWidth = this.context.measureText(letter).width;
      if (symbolWidth === 0 || letter === '\n') { continue; }

      if (symbolWidth + startX > textureWidth) {
        startY += fontSize + paddingTop;
        startX = 0;
      }

      const [top, bottom] = this.getLetterBoundingBox(letter, fontSize, fontName);
      const symbolData = new SymbolData();
      symbolData.width = symbolWidth;
      symbolData.height = bottom - top + 1;
      symbolData.symbol = letter;
      symbolData.startY = top;
      symbolData.tx = startX / textureWidth;
      symbolData.ty = (startY - fontSize + top) / textureHeight;
      symbolData.tw = symbolData.width / textureWidth;
      symbolData.th = symbolData.height / textureHeight;
      this.symbolDatas.push(symbolData);

      this.context.fillText(letter, startX, startY);
      startX += symbolWidth + paddingRight;
    }
  }

  save(fontBitmapFileName: string, fontDataFileName: string): void {
    const hiddenCanvas = document.createElement('canvas');
    hiddenCanvas.width = this.textureWidth;
    hiddenCanvas.height = this.textureHeight;

    const context = hiddenCanvas.getContext('2d') as CanvasRenderingContext2D;
    context.drawImage(this.canvasElement,
      0, 0, this.textureWidth, this.textureHeight,
      0, 0, this.textureWidth, this.textureHeight);

    const base64data = hiddenCanvas.toDataURL();
    const hrefBitmapElement = document.createElement('a');
    hrefBitmapElement.download = fontBitmapFileName;
    hrefBitmapElement.href = base64data;
    hrefBitmapElement.click();

    const textJsonData = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.symbolDatas));
    const hrefDataElement = document.createElement('a');
    hrefDataElement.download = fontDataFileName;
    hrefDataElement.href = textJsonData;
    setTimeout(() => hrefDataElement.click(), 1500);
  }

  private getLetterBoundingBox(letter: string, fontSize: number, fontName: string): [number, number] {
    this.letterContext.clearRect(0, 0, this.letterCanvas.width, this.letterCanvas.height);
    this.letterContext.fillStyle = '#fff';
    this.letterContext.font = `${fontSize}px ${fontName}`;
    const symbolRectWidth = this.letterContext.measureText(letter).width + 5;
    const symbolRectHeight = fontSize * 2;
    this.letterContext.fillText(letter, 5, fontSize + 5);

    const imageData = this.letterContext.getImageData(0, 0, symbolRectWidth, symbolRectHeight);

    return [this.scanRectForTop(imageData) - 5, this.scanRectForBottom(imageData) - 5];
  }

  private scanRectForTop(imageData: ImageData): number {
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

  private scanRectForBottom(imageData: ImageData): number {
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
}
