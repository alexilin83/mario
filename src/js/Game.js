import * as PIXI from 'pixi.js';
import Scroller from './Scroller';
import Player from './Player';
import Enemy from './Enemy';

export default class Game {
    constructor() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.gravity = 0.3;
        this.friction = 0.8;

        this.app = null;
        this.loader = PIXI.Loader.shared;

        this.scroller = null;

        this.player = null;

        this.enemies = [];
        this.enemiesAmount = 2;

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
            .add("enemy", "images/enemy.json")
            .load(this.setup);
    }
    setup(loader, resources) {
        console.log('loaded');

        this.scroller = new Scroller(this);

        this.player = new Player(this);
        this.app.stage.addChild(this.player);
        this.player.y = this.scroller.ground.slices[0].sprite.y - this.player.height;

        for (let i = 0; i < this.enemiesAmount; i++) {
            let enemy = new Enemy(this.scroller.game);
            this.enemies.push(enemy);
            this.app.stage.addChild(enemy);
            enemy.play();

            let randomGround = this.scroller.ground.slices[Math.floor(Math.random() * 6) + 3];
            enemy.x = randomGround.sprite.x;
            enemy.y = randomGround.sprite.y - enemy.height;
        }

        this.left.press = () => {
            this.player.anchor.set(1, 0);
            this.player.transform.scale.x = -1;
        }

        this.right.press = () => {
            this.player.anchor.set(0, 0);
            this.player.transform.scale.x = 1;
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
            if (this.player.vx > -this.player.speed) {
                this.player.vx--;
            }
        }
        if (this.right.isDown) {
            if (this.player.vx < this.player.speed) {
                this.player.vx++;
            }
        }
        if (this.space.isDown) {
            if (!this.player.isJumping && this.player.isOnGround) {
                this.player.isJumping = true;
                this.player.isOnGround = false;
                this.player.vy = -this.player.speed * 2.1;
            }
        }

        if (this.player.isJumping) {
            this.player.gotoAndStop(2);
        } else if (this.left.isDown || this.right.isDown) {
            this.player.play();
        } else {
            this.player.gotoAndStop(0);
        }

        this.player.vx *= this.friction;
        this.player.vy += this.gravity;

        this.player.isOnGround = false;

        this.enemies.forEach((enemy) => {
            enemy.vx = -enemy.speed;
            enemy.vy += this.gravity;

            enemy.isOnGround = false;

            let dir = this.checkCollide(this.player, enemy);
            if (dir) {
                if (dir === 'left' || dir === 'right' || dir === 'up') {
                    this.player.isHitted = true;
                    console.log('killed');
                    
                } else if (dir === 'down') {
                    this.player.vy = -this.player.speed * 1.1;
                }
            }
        });

        this.scroller.ground.slices.forEach((slice) => {
            let sprite = slice.sprite;

            if (sprite) {
                let collideDirPlayer = this.checkCollide(this.player, sprite);
                if (collideDirPlayer) {
                    if (collideDirPlayer === 'left' || collideDirPlayer === 'right') {
                        this.player.vx = 0;
                    } else if (collideDirPlayer === 'down') {
                        this.player.isOnGround = true;
                        this.player.isJumping = false;
                    } else if (collideDirPlayer === 'up') {
                        this.player.vy *= -1;
                    }
                }
                this.enemies.forEach((enemy) => {
                    let collideDirEnemy = this.checkCollide(enemy, sprite);
                    if (collideDirEnemy) {
                        if (collideDirEnemy === 'left' || collideDirEnemy === 'right') {
                            enemy.vx = 0;
                        } else if (collideDirEnemy === 'down') {
                            enemy.isOnGround = true;
                        }
                    }
                });
            }
        });

        this.enemies.forEach((enemy) => {
            if (enemy.isOnGround) {
                enemy.vy = 0;
            }

            enemy.x += enemy.vx;
            enemy.y += enemy.vy;
        });

        if (this.player.isOnGround) {
            this.player.vy = 0;
        }

        this.player.x += this.player.vx;
        this.player.y += this.player.vy;

        if (this.player.x < 0) {
            this.player.x = 0;
        }
        if (this.player.x > this.w - this.player.width) {
            this.player.x = this.w - this.player.width;
        }
        if ((this.player.x > this.w / 2 + 100) && !this.scroller.ground.slices[this.scroller.ground.slices.length - 1].sprite) {
            this.scroller.moveViewportXBy(5);
            this.player.x = this.w / 2 + 99;

            this.enemies.forEach((enemy) => {
                enemy.speed = 6;
            });
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
    checkCollide(r1, r2) {
        let halfWidths,
            halfHeights,
            vx,
            vy,
            ox,
            oy,
            collideDir = null;

        r1.halfWidth = r1.width / 2;
        r2.halfWidth = r2.width / 2;
        r1.halfHeight = r1.height / 2;
        r2.halfHeight = r2.height / 2;

        vx = r1.x + r1.halfWidth - (r2.x + r2.halfWidth);
        vy = r1.y + r1.halfHeight - (r2.y + r2.halfHeight);

        halfWidths = r1.halfWidth + r2.halfWidth;
        halfHeights = r1.halfHeight + r2.halfHeight;

        if (Math.abs(vx) < halfWidths && Math.abs(vy) < halfHeights) {
            ox = halfWidths - Math.abs(vx);
            oy = halfHeights - Math.abs(vy);
            if (ox >= oy) {
                if (vy > 0) {
                    collideDir = 'up';
                    r1.y += oy;
                } else {
                    collideDir = 'down';
                    r1.y -= oy;
                }
            } else {
                if (vx > 0) {
                    collideDir = 'left';
                    r1.x += ox;
                    
                } else {
                    collideDir = 'right';
                    r1.x -= ox;
                }
            }
        }

        return collideDir;
    }
}