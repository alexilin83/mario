
import * as PIXI from 'pixi.js';
import '../css/index.css';

let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas";
}

let App = PIXI.Application,
    loader = PIXI.Loader.shared,
    resources = loader.resources,
    Sprite = PIXI.TilingSprite,
    Rectangle = PIXI.Rectangle;

let app = new App({
    width: 256,
    height: 256,
    antialias: true,
    // transparent: true,
    resolution: 1
});

document.body.appendChild(app.view);

loader
    .add("commonSprite", "images/sprite.png")
    .on("progress", loadProgressHandler)
    .load(setup);
let sprites = {};

function loadProgressHandler(loader, resources) {
    console.log('loading');
}

function setup() {
    console.log('loaded');
    let marioRect = new Rectangle(928, 18, 26, 33);
    sprites.mario = new Sprite(resources.commonSprite.texture);
    sprites.mario.frame = marioRect;
    app.stage.addChild(sprites.mario);
}

