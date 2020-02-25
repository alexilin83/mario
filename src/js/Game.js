
import * as PIXI from 'pixi.js';
import Cloud from './Cloud';

export default class Game {
    constructor() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.app = null;
        this.clouds = null;
        this.mario = null;
        this.enemy = null;
        this.left = this.keyboard("ArrowLeft"),
        this.right = this.keyboard("ArrowRight");
        this.loader = PIXI.Loader.shared;
        this.setup = this.setup.bind(this);
    }
    init() {
        this.app = new PIXI.Application({
            width: this.w,
            height: this.h,
            antialias: true,
            resolution: 1,
            backgroundColor: '0x5E91FE'
        });
        document.body.appendChild(this.app.view);

        this.loader
            .add("commonSprite", "images/sprite.png")
            .add("clouds", "images/clouds.png")
            .load(this.setup);

    }
    setup() {
        console.log('loaded');

        let textureClouds = new PIXI.Texture(this.loader.resources.clouds.texture);
        this.clouds = new Cloud(textureClouds, this.w, 264);
        this.app.stage.addChild(this.clouds);
    
        let tileset = PIXI.utils.TextureCache["images/sprite.png"];
    
        let marioFrame = new PIXI.Rectangle(929, 18, 26, 33);
        let textureMario = new PIXI.Texture(tileset, marioFrame);
        this.mario = new PIXI.Sprite(textureMario);
        this.mario.x = 100;
        this.mario.y = this.h - 470;
        this.mario.vx = 0;
        this.mario.width = 26;
        this.mario.height = 33;
        this.app.stage.addChild(this.mario);
    
        let enemyFrame = new PIXI.Rectangle(503, 727, 34, 34);
        let textureEnemy = new PIXI.Texture(tileset, enemyFrame);
        this.enemy = new PIXI.Sprite(textureEnemy);
        this.enemy.x = 500;
        this.enemy.y = this.h - 470;
        this.enemy.vx = 0;
        this.enemy.width = 34;
        this.enemy.height = 34;
        this.app.stage.addChild(this.enemy);

        this.left.press = () => {
            this.mario.vx = -5;
        }
    
        this.left.release = () => {
            if (!this.right.isDown) {
                this.mario.vx = 0;
            }
        }
    
        this.right.press = () => {
            this.mario.vx = 5;
        }
        this.right.release = () => {
            if (!this.left.isDown) {
                this.mario.vx = 0;
            }
        }
        this.app.ticker.add(delta => this.update(delta));
    }
    update(delta) {
        this.mario.x += this.mario.vx;
        if (this.left.isDown) {
            this.clouds.moveViewportX(1);
        } else if (this.right.isDown) {
            this.clouds.moveViewportX(-1);
        }
    }
    keyboard(value) {
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
}