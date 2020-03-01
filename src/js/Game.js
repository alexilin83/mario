import * as PIXI from 'pixi.js';
import Scroller from './Scroller';
import Player from './Player';

export default class Game {
    constructor() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.app = null;
        this.loader = PIXI.Loader.shared;

        this.viewportX = 0;

        this.scroller = null;

        this.player = null;

        this.left = this.keyboard("ArrowLeft"),
        this.right = this.keyboard("ArrowRight");

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
            .add("sky", "images/sky.png")
            .add("ground", "images/ground.json")
            .add("player", "images/player.json")
            .load(this.setup);

    }
    setup(loader, resources) {
        console.log('loaded');

        this.scroller = new Scroller(this);

        this.player = new Player(this);
        
        this.app.stage.addChild(this.player);
    
        this.left.press = () => {
            this.player.vx = -5;
        }
        this.left.release = () => {
            if (!this.right.isDown) {
                this.player.vx = 0;
            }
        }
        this.right.press = () => {
            this.player.vx = 5;
        }
        this.right.release = () => {
            if (!this.left.isDown) {
                this.player.vx = 0;
            }
        }

        this.app.ticker.add(delta => this.update(delta));
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
    update(delta) {
        
        if (this.left.isDown) {
            if (this.player.x < this.w / 2 - this.w / 4) {
                this.scroller.moveViewportXBy(-5);
            } else {
                this.player.x += this.player.vx;
                this.player.update();
            }
        } else if (this.right.isDown) {
            if (this.player.x > this.w / 2 + this.w / 4) {
                this.scroller.moveViewportXBy(5);
            } else {
                this.player.x += this.player.vx;
                this.player.update();
            }
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