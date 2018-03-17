import { Game } from './game/rts-game/game';

const canvas = document.getElementById('canvas-main') as HTMLCanvasElement;
if (canvas) {
    const game = new Game(canvas);
    game.run();
}
