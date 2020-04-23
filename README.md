# TypeScript WebGL Game Framework

In theory it is small code-oriented framework for building html5 games.  
In fact it is just a beginning of that.

## Quick demo
* [Simple shooter game](https://perfectdaemon.github.io/151/index.html) — for [IGDC-151 contest](http://igdc.ru/igdc_top.php?konkurs=151), February, 2018

![Simple shooter game gif](https://github.com/perfectdaemon/ts-game/raw/master/promo/3_2.gif)
* [Space RPG game](https://perfectdaemon.github.io/159/index.html) — for [IGDC-159 contest](http://igdc.ru/igdc_top.php?konkurs=159), January, 2019

## Features
In alphabetical order:
* GUI
  * Button
* Helpers
  * Action manager — perform actions (simple or continuos) with pause, chain them and so on. No more timers and flags in `update()` method
  * Event — simple observable with subscribe functionality
  * Pool — do not create/delete items with short time to life. Reuse them.
  * Tween — perform curve based animations
* Input — keyboard, mouse, touches
* Asset loading — async with promises
* Math — vectors, matrices
* Physics — simple collision detection
* Render
  * WebGL renderer
  * Texture atlases
  * Font rendering
* Render 2D
  * Sprite
  * Text
* Scene
  * Node
  * Camera
* Scenes — game, menu, options, pause management routines
* Sound — play sounds and music

## What features are in progress?
* Sprite animations (spritesheet and object based)
* Physics engine - p2 (https://github.com/schteppe/p2.js)
* More GUI (sliders, inputs)
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
1. Run game: ``` $ npm run start:{game} ``` with dev server and hot reload
or
1. Get release: ```$ npm run build:{game}``` — minified and optimized build at **/dist/{game}** folder
