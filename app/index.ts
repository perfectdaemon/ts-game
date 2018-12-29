import { Game } from './game/box2d-demo/game';

const canvas = document.getElementById('canvas-main') as HTMLCanvasElement;
if (canvas) {
    const game = new Game(canvas);
    game.run();
}
