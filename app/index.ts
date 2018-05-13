import { Game } from './game/template-game/game';

const canvas = document.getElementById('canvas-main') as HTMLCanvasElement;
if (canvas) {
    const game = new Game(canvas);
    game.run();
}
