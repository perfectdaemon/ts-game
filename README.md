# TypeScript WebGL Game Framework

In theory it is small code-oriented framework for building html5 games.  
In fact it is just a beginning of that.

## What have we got?
* WebGL rendering
* Scene management: camera, node
* 2D graphics: sprite, text
* Texture atlases
* Audio
* Bitmap font generator
* Math classes
* Async asset loading
* ActionManager (do actions with timeout, continuos and so on, no more timers at your Game class)
* Menu framework (Main Menu, Settings and so on)

## What is in progress at now
* Tweening (curve-based animations)
* Sprite animations (spritesheet and object based)
* Physics engine - p2 (https://github.com/schteppe/p2.js)
* GUI (buttons, sliders, inputs)
* Particles

## Global roadmap
* 2D graphics full support
* 2D physics
* 2D games
* 3D graphics

## Quick start

1. Install **node.js** with **npm** (https://nodejs.org/en/)
1. Open your favorite IDE/editor. *I prefer Visual Studio Code.*
1. Open your favorite terminal (bash, cmd, powershell) at project's root folder
1. Type ``` $ npm install ``` or ```$ npm i``` for package restore
1. Run develop: ``` $ npm run start ``` with watching (file hot reload) and lite-server   
or
1. Get release: ```$ npm run build``` — minified and optimized build at **/dist** folder
