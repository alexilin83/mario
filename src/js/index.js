
import * as PIXI from 'pixi.js';
import '../css/index.css';

let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas";
}

let w = window.innerWidth;
let h = window.innerHeight;

let App = PIXI.Application,
    loader = PIXI.Loader.shared,
    resources = loader.resources,
    Sprite = PIXI.TilingSprite,
    Rectangle = PIXI.Rectangle,
    TextureCache = PIXI.utils.TextureCache;

let app = new App({
    width: w,
    height: h,
    antialias: true,
    // transparent: true,
    resolution: 1
});

document.body.appendChild(app.view);

loader
    .add("commonSprite", "images/sprite.png")
    .add("bg", "images/bg.jpg")
    .load(setup);

let BG;
let mario;
let ball;

let state;

function loadProgressHandler(loader, resources) {
    console.log('loading');
}

function setup() {
    console.log('loaded');

    let textureBG = resources.bg.texture;
    let bgRect = new Rectangle(0, 0, w, h);
    textureBG.frame = bgRect;
    BG = new Sprite(textureBG);
    BG.width = w;
    BG.height = h;

    let tileset = TextureCache["images/sprite.png"];

    // let textureMario = resources.commonSprite.texture;
    let marioRect = new Rectangle(929, 18, 26, 33);
    let textureMario = new PIXI.Texture(tileset, marioRect);
    mario = new Sprite(textureMario);
    mario.x = 100;
    mario.y = h - 470;
    mario.vx = 0;
    mario.vy = 0;
    mario.width = 26;
    mario.height = 33;

    // let textureBall = resources.commonSprite.texture;
    let ballRect = new Rectangle(503, 727, 34, 34);
    let textureBall = new PIXI.Texture(tileset, ballRect);
    textureBall.frame = ballRect;
    ball = new Sprite(textureBall);
    ball.x = 500;
    ball.y = h - 470;
    ball.vx = 0;
    ball.vy = 0;
    ball.width = 34;
    ball.height = 34;

    app.stage
        .addChild(BG)
        .addChild(mario)
        .addChild(ball);

    let left = keyboard("ArrowLeft"),
        up = keyboard("ArrowUp"),
        right = keyboard("ArrowRight"),
        down = keyboard("ArrowDown");

    left.press = () => {
        mario.vx = -5;
        mario.vy = 0;
    }

    left.release = () => {
        if (!right.isDown && mario.vy === 0) {
            mario.vx = 0;
        }
    }

    up.press = () => {
        mario.vy = -5;
        mario.vx = 0;
    };
    up.release = () => {
        if (!down.isDown && mario.vx === 0) {
            mario.vy = 0;
        }
    };

    right.press = () => {
        mario.vx = 5;
        mario.vy = 0;
    }
    right.release = () => {
        if (!left.isDown && mario.vy === 0) {
            mario.vx = 0;
        }
    }

    down.press = () => {
        mario.vy = 5;
        mario.vx = 0;
    };
    down.release = () => {
        if (!up.isDown && mario.vx === 0) {
            mario.vy = 0;
        }
    };

    state = play;

    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
    state(delta);
}

function play(delta) {
    mario.x += mario.vx;
    mario.y += mario.vy;
}

function keyboard(value) {
    let key = {};
    key.value = value;
    key.isUp = true;
    key.isDown = false;
    key.press = undefined;
    key.release = undefined;

    key.downHandler = event => {
        if (event.key === key.value) {
            if (key.isUp && key.press) key.press();
            key.isUp = false;
            key.isDown = true;
            event.preventDefault();
        }
    }

    key.upHandler = event => {
        if (event.key === key.value) {
            if (key.isDown && key.release) key.release();
            key.isUp = true;
            key.isDown = false;
            event.preventDefault();
        }
    }

    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener('keydown', downListener, false);
    window.addEventListener('keyup', upListener, false);

    key.unsubscribe = () => {
        window.removeEventListener('keydown', downListener);
        window.removeEventListener('keyup', upListener);
    }

    return key;
}