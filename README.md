# TypeScript WebGL Game Framework

In theory it is small code-oriented framework for building html5 games.  
In fact it is just a beginning of that.

## What have we got?
* WebGL renderer with base classes for Vertex/Index/Frame buffers, Texture, Shader and so on
* Scene management: Camera, Node
* 2D graphics - Sprite, Text, SpriteBatch renderer
* Math classes - Vectors, Matrix
* TextureAtlas
* Async asset loaders based on Promise<>

## What is in progress
* Font, TextBatch

## Roadmap
* 2D graphics full support
* more maths, sound, physics
* games
* 3d graphics
* ...

## Quick start

**Build and run**

1. Install **node.js** with **npm**
1. Open your favourite terminal at project's root folder
1. ``` $ npm install ```
1. Run develop: ``` $ npm run start ```  
or
1. Get release: ```$ npm run build``` — makes minified and optimized build at **/dist** folder

**Develop**

1. Open your favourite IDE/editor. *I prefer Visual Studio Code.*
1. Open your favourite terminal at project's root folder
1. DEV: Develop!
1. In terminal run ```$ npm run start``` and watch the result in a browser
1. GOTO DEV; Project will be automatically rebuild and browser will automatically refresh the page on every file saved. *magic!*
