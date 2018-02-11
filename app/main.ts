import { Game } from './game/garbage-game/game';

const canvas = document.getElementById('canvas-main') as HTMLCanvasElement;
if (canvas) {
    const game = new Game(canvas);
    game.run();
}
