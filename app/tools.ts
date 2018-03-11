import { BitmapFontGenerator } from './tools/font-generator/font-generator';

function getInput(inputElementId: string): HTMLInputElement {
  return document.getElementById(inputElementId) as HTMLInputElement;
}

function getElement(elementId: string): HTMLElement {
  return document.getElementById(elementId) as HTMLElement;
}

const inputs = {
  fontName: getInput('fontName'),
  fontSize: getInput('fontSize'),
  textureWidth: getInput('textureWidth'),
  textureHeight: getInput('textureHeight'),
  paddingTop: getInput('paddingTop'),
  paddingRight: getInput('paddingRight'),
  fontText: getInput('fontText'),
};

inputs.fontName.value = 'Arial';
inputs.fontSize.value = '24';
inputs.textureWidth.value = '256';
inputs.textureHeight.value = '256';
inputs.paddingTop.value = '1';
inputs.paddingRight.value = '1';
inputs.fontText.value = ` 0123456789!@#$%^&*()_+|{}:"<>?-=\\[];',./~\`«–»—
abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ`;

const canvas = document.getElementById('canvas-main') as HTMLCanvasElement;
const bfg = new BitmapFontGenerator(canvas);

getElement('download').onclick = (event) => {
  event.preventDefault();
  bfg.save(`${inputs.fontName.value}.png`, `${inputs.fontName.value}.json`);
};

getElement('generate').onclick = (event) => {
  event.preventDefault();
  bfg.draw(inputs.fontText.value,
    parseInt(inputs.fontSize.value), inputs.fontName.value,
    parseInt(inputs.textureWidth.value), parseInt(inputs.textureHeight.value),
    parseInt(inputs.paddingTop.value), parseInt(inputs.paddingRight.value));
};

getElement('generate').click();
