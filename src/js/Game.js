import * as PIXI from 'pixi.js';
import Scroller from './Scroller';
import Player from './Player';

export default class Game {
    constructor() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.gravity = 3;

        this.app = null;
        this.loader = PIXI.Loader.shared;

        this.scroller = null;

        this.player = null;

        this.left = this.keyboard("ArrowLeft"),
        this.right = this.keyboard("ArrowRight");
        this.space = this.keyboard(" ");

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
        this.player.y = this.scroller.ground.slices[0].sprite.y;

        this.space.press = () => {
            if (this.player.isOnGround) {
                this.player.isJumping = true;
                this.player.isOnGround = false;
            }
        }
        this.space.release = () => {
            this.player.isJumping = false;
            this.player.isFalling = true;
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
    update() {
        if (this.left.isDown) {
            if (this.player.x > 35) {
                this.player.vx = -5;
            } else {
                this.player.vx = 0;
            }
            if (this.player.transform.scale.x == 1) {
                this.player.x += 30;
                this.player.transform.scale.x = -1;
            }
        }
        if (this.right.isDown) {
            if (this.player.transform.scale.x == -1) {
                this.player.x -= 30;
                this.player.transform.scale.x = 1;
            }
            if (this.player.x > this.w / 2 + 100) {
                this.scroller.moveViewportXBy(5);
                this.player.vx = 0;
            } else {
                this.player.vx = 5;
            }
        }
        if (!this.left.isDown && !this.right.isDown) {
            this.player.vx = 0;
            this.player.gotoAndStop(0);
        } else {
            this.player.play();
        }

        for (let i = 0, l = this.scroller.ground.slices.length - 1; i < l; i++) {
            let slice = this.scroller.ground.slices[i];
            let sprite = slice.sprite;
            if (sprite && this.player.x + this.player.width / 2 > sprite.x && this.player.x + this.player.width / 2 < sprite.x + sprite.width) {
                if (slice.type === 'gap') {
                    this.player.isFalling = true;
                    
                }
                if (this.player.isJumping) {
                    if (this.player.y > sprite.y - this.player.jumpTreshold + this.player.height) {
                        this.player.vy = -10;
                    }
                    if (this.player.y <= sprite.y - this.player.jumpTreshold + this.player.height) {
                        this.player.isJumping = false;
                        this.player.isFalling = true;
                        this.player.vy = 5 + this.gravity;
                    }
                } else if (this.player.isFalling) {
                    if (this.player.y < sprite.y - 15) {
                        this.player.vy = 15;
                    }
                    if (this.player.y >= sprite.y - 15) {
                        this.player.vy = 0;
                        this.player.y = sprite.y;
                        this.player.isFalling = false;
                        this.player.isOnGround = true;
                    }
                }
            }
        }

        if (this.player.isJumping || this.player.isFalling) {
            this.player.gotoAndStop(2);
        }

        this.player.x += this.player.vx;
        this.player.y += this.player.vy;

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