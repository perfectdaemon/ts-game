import { Game } from './game';

const canvas = document.getElementById('canvas-main') as HTMLCanvasElement;
const loader = document.getElementById('loader') as HTMLElement;
if (canvas) {
    const game = new Game(canvas, loader);
    game.run();
}
