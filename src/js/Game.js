
import * as PIXI from 'pixi.js';

export default class Game {
    constructor() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.app = null;
        this.clouds = null;
        this.ground = [];
        this.groundSlices = [];
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
            .add("images/ground.json")
            .load(this.setup);

    }
    setup(loader, resources) {
        console.log('loaded');

        let textureClouds = new PIXI.Texture(this.loader.resources.clouds.texture);
        this.clouds = new PIXI.TilingSprite(textureClouds, this.w, 264);
        this.app.stage.addChild(this.clouds);

        this.groundSpritesPool();
        this.borrowGroundSprites(7);
    
        let tileset = PIXI.utils.TextureCache["images/sprite.png"];
    
        let marioFrame = new PIXI.Rectangle(929, 18, 26, 33);
        let textureMario = new PIXI.Texture(tileset, marioFrame);
        this.mario = new PIXI.Sprite(textureMario);
        this.mario.x = 100;
        this.mario.y = this.h - 200;
        this.mario.vx = 0;
        this.mario.width = 26;
        this.mario.height = 33;
        this.app.stage.addChild(this.mario);
    
        let enemyFrame = new PIXI.Rectangle(503, 727, 34, 34);
        let textureEnemy = new PIXI.Texture(tileset, enemyFrame);
        this.enemy = new PIXI.Sprite(textureEnemy);
        this.enemy.x = 500;
        this.enemy.y = this.h - 200;
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
    groundSpritesPool() {
        this.createGround();
    }
    borrowGround() {
        return this.ground.shift();
    }
    returnGround(sprite) {
        this.ground.push(sprite);
    }
    createGround() {
        this.addGroundSprites(2, 'ground1.png');
        this.addGroundSprites(2, 'ground2.png');
        this.addGroundSprites(2, 'ground3.png');
        this.addGroundSprites(2, 'ground4.png');

        this.shuffle(this.ground);
        
    }
    addGroundSprites(amount, frameId) {
        let groundID = this.loader.resources["images/ground.json"].textures;
        for (let i = 0; i < amount; i++) {
            let sprite = new PIXI.Sprite(groundID[frameId]);
            this.ground.push(sprite);
        }
    }
    shuffle (array) {
        let len = array.length;
        let shuffles = len * 3;
        for (let i = 0; i < shuffles; i++) {
            let groundSlice = array.pop();
            let pos = Math.floor(Math.random() * (len - 1));
            array.splice(pos, 0, groundSlice);
        }
    }
    borrowGroundSprites(num) {
        for (let i = 0; i < num; i++) {
            let sprite = this.borrowGround();
            sprite.position.x = (i * 225);
            sprite.position.y = this.h - 220;

            this.groundSlices.push(sprite);
            this.app.stage.addChild(sprite);
        }
    }
    returnGroundSprites() {
        for (let i = 0; i < this.groundSlices.length; i++) {
            let sprite = this.groundSlices[i];
            this.app.stage.removeChild(sprite);
            this.returnGround(sprite);
        }
        this.groundSlices = [];
    }
    update(delta) {
        this.mario.x += this.mario.vx;
        if (this.left.isDown) {
            this.clouds.tilePosition.x += 1;
        } else if (this.right.isDown) {
            this.clouds.tilePosition.x -= 1;
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