"use strict";
var Vector = /** @class */ (function () {
    function Vector() {
    }
    return Vector;
}());
var Player = /** @class */ (function () {
    function Player() {
    }
    Player.prototype.draw = function (context) {
        context.beginPath();
        context.strokeStyle = "#f44";
        context.arc(this.look.x, this.look.y, 10, -1, 6.28 - 1.57 - 0.57);
        context.stroke();
        context.save();
        context.fillStyle = "#f44";
        context.fillRect(this.position.x, this.position.y, 10, 10);
        context.restore();
    };
    return Player;
}());
var App = /** @class */ (function () {
    function App(canvasElement) {
        this.canvasElement = canvasElement;
        this.context = canvasElement.getContext('2d');
        this.player = new Player();
        this.canvasPos = {
            left: this.canvasElement.getBoundingClientRect().left,
            top: this.canvasElement.getBoundingClientRect().top
        };
    }
    App.start = function () {
        var canvas = document.getElementById('canvas-main');
        if (!canvas)
            return;
        var app = new App(canvas);
        app.run();
    };
    App.prototype.run = function () {
        var _this = this;
        console.log('Run, TypeScript, run!');
        this.player.position = { x: 400, y: 300 };
        this.player.look = { x: 0, y: 0 };
        this.canvasElement.onmousemove = function (event) { return _this.onMouseMove(event); };
        var cycle = function (timestamp) {
            _this.onUpdate(timestamp);
            _this.onRender(timestamp);
            window.requestAnimationFrame(cycle);
        };
        window.requestAnimationFrame(cycle);
    };
    App.prototype.onUpdate = function (timestamp) {
    };
    App.prototype.onRender = function (timestamp) {
        this.context.clearRect(0, 0, 800, 600);
        this.context.font = "16pt serif";
        this.context.fillText("Hello " + timestamp, 10, 16);
        this.player.draw(this.context);
    };
    App.prototype.onMouseMove = function (event) {
        this.player.look = {
            x: event.pageX - this.canvasPos.left,
            y: event.pageY - this.canvasPos.top
        };
    };
    return App;
}());
App.start();
