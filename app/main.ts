import { Game } from './game/game';

const canvas = <HTMLCanvasElement>document.getElementById('canvas-main');
if (canvas) {
    const game = new Game(canvas);
    game.run();
}
