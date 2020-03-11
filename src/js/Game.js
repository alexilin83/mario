import * as PIXI from 'pixi.js';
import Scroller from './Scroller';
import Player from './Player';

export default class Game {
    constructor() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;

        this.app = null;
        this.loader = PIXI.Loader.shared;

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
            if (this.player.transform.scale.x == 1) {
                this.player.x += 30;
                this.player.transform.scale.x = -1;
            }
            this.player.play();
        }
        this.left.release = () => {
            if (!this.right.isDown) {
                this.player.vx = 0;
                this.player.gotoAndStop(0);
            }
        }
        this.right.press = () => {
            this.player.vx = 5;
            if (this.player.transform.scale.x == -1) {
                this.player.x -= 30;
                this.player.transform.scale.x = 1;
            }
            this.player.play();
        }
        this.right.release = () => {
            if (!this.left.isDown) {
                this.player.vx = 0;
                this.player.gotoAndStop(0);
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
            if (this.player.x > 35) {
                this.player.x += this.player.vx;
            }
            
        } else if (this.right.isDown) {
            if (this.player.x > this.w / 2 + 100) {
                this.scroller.moveViewportXBy(5);
            } else {
                this.player.x += this.player.vx;
            }
        }

        for (let i = 0, l = this.scroller.ground.slices.length - 1; i < l; i++) {
            let sprite = this.scroller.ground.slices[i].sprite;
            if (sprite && (this.player.x >= sprite.x && this.player.x < sprite.x + sprite.width)) {
                console.log(111);
                
                this.player.y = sprite.y;
            } else if (this.player.x >= sprite.x && this.player.x < sprite.x + sprite.width) {

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
    hitTestRectangle(r1, r2) {
        let hit, combineHalfWidths, combineHalfHeights, vx, vy;

        hit = false;

        r1.halfWidth = r1.width / 2;
        r1.halfHeight = r1.height / 2;
        r2.halfWidth = r2.width / 2;
        r2.halfHeight = r2.height / 2;

        r1.centerX = r1.x + r1.halfWidth;
        r1.centerY = r1.y + r1.halfHeight;
        r2.centerX = r2.x + r2.halfWidth;
        r2.centerY = r2.y + r2.halfHeight;

        vx = r1.centerX - r2.centerX;
        vy = r1.centerY - r2.centerY;

        combineHalfWidths = r1.halfWidth + r2.halfWidth;
        combineHalfHeights = r1.halfHeight + r2.halfHeight;

        if (Math.abs(vx) < combineHalfWidths) {
            if (Math.abs(vy) < combineHalfHeights) {
                hit = true;
            } else {
                hit = false;
            }
        } else {
            hit = false;
        }

        return hit;
    }
}