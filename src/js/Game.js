import { Application, Loader, Container, Text, TextStyle } from 'pixi.js';
import Sky from './Sky';
import Ground from './Ground';
import Objects from './Objects';
import Player from './Player';

export default class Game {
    constructor() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.gravity = 0.3;
        this.friction = 0.8;
        this.viewportX = 0;

        this.state = this.play;

        this.app = null;
        this.loader = Loader.shared;

        this.gameScene = new Container();
        this.gameOverScene = new Container();
        this.sky = null;
        this.ground = null;
        this.objects = null;
        this.player = null;

        this.left = this.keyboard("ArrowLeft"),
        this.right = this.keyboard("ArrowRight");
        this.space = this.keyboard(" ");

        this.setup = this.setup.bind(this);

        this.textStyle = new TextStyle({
            fontFamily: "Arial",
            fontSize: 36,
            fill: "white",
            stroke: '#ff3300',
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: "#000000",
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
        });
        this.message = new Text('', this.textStyle);

    }
    init() {
        this.app = new Application({
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
            .add("main", "sound/main.mp3")
            .add("jump", "sound/jump.wav")
            .add("kick", "sound/kick.wav")
            .load(this.setup);
    }
    setup(loader, resources) {
        console.log('loaded');

        this.app.stage.addChild(this.gameScene);
        this.app.stage.addChild(this.gameOverScene);

        this.sky = new Sky(this);
        this.gameScene.addChild(this.sky);

        this.ground = new Ground(this);
        this.gameScene.addChild(this.ground);

        this.objects = new Objects(this);
        this.gameScene.addChild(this.objects);

        this.player = new Player(this);
        this.gameScene.addChild(this.player);
        this.player.y = this.ground.slices[0].sprite.y - this.player.height;

        // resources.main.sound.play();

        this.left.press = () => {
            this.player.anchor.set(1, 0);
            this.player.transform.scale.x = -1;
        }

        this.right.press = () => {
            this.player.anchor.set(0, 0);
            this.player.transform.scale.x = 1;
        }

        this.gameOverScene.visible = false;
        this.gameOverScene.addChild(this.message);

        this.message.x = (this.w / 2) - (this.message.width / 2);
        this.message.y = (this.h / 2) - (this.message.height / 2);

        this.app.ticker.add(delta => this.gameLoop(delta));
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
    gameLoop(delta) {
        this.state(delta);
    }
    play() {
        if (!this.player.isDead) {
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
        }

        if (this.player.isDead) {
            this.player.textures = this.loader.resources.player.spritesheet.animations['death'];
        } else if (this.player.isJumping) {
            this.player.gotoAndStop(3);
        } else if (this.left.isDown || this.right.isDown) {
            this.player.play();
            this.player.onFrameChange = frame => {
                if (frame == 3 && !this.player.isJumping) {
                    this.player.gotoAndPlay(0);
                }
            }
        } else {
            this.player.gotoAndStop(0);
        }

        this.player.vx *= this.friction;
        this.player.vy += this.gravity;

        if (!this.player.isDead) {
            this.player.isOnGround = false;
    
            this.ground.slices.forEach((slice) => {
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
                }
            });

            this.objects.enemies.forEach((enemy) => {
                let dir = this.checkCollide(this.player, enemy);
                if (dir) {
                    if (dir === 'left' || dir === 'right' || dir === 'up') {
                        this.player.vy = -this.player.speed * 1.1;
                        this.player.isDead = true;
                    } else if (dir === 'down') {
                        this.player.vy = -this.player.speed * 1.1;
                        enemy.isHitted = true;
                    }
                }
            });
    
            if (this.player.isOnGround) {
                this.player.vy = 0;
            }
        }

        this.player.x += this.player.vx;
        this.player.y += this.player.vy;

        if (this.player.x < 0) {
            this.player.x = 0;
        }
        if (this.player.x > this.w - this.player.width) {
            this.player.x = this.w - this.player.width;
        }
        if ((this.player.x > this.w / 2 + 100) && !this.ground.slices[this.ground.slices.length - 1].sprite) {
            this.viewportX += 5;
            this.sky.setViewportX(this.viewportX);
            this.ground.setViewportX(this.viewportX);
            this.objects.setViewportX(this.viewportX);
            this.player.x = this.w / 2 + 99;
        }

        if (this.player.y > this.h) {
            this.message.text = 'You die!';
            this.state = this.end;
        }

        if (!this.objects.enemies.length) {
            this.message.text = 'You won!';
            this.state = this.end;
        }

        this.sky.update();
        this.objects.update();
    }
    end() {
        this.gameScene.visible = false;
        this.gameOverScene.visible = true;
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
            pos1,
            pos2,
            collideDir = null;

        r1.halfWidth = r1.width / 2;
        r2.halfWidth = r2.width / 2;
        r1.halfHeight = r1.height / 2;
        r2.halfHeight = r2.height / 2;

        pos1 = r1.getGlobalPosition();
        pos2 = r2.getGlobalPosition();

        vx = pos1.x + r1.halfWidth - (pos2.x + r2.halfWidth);
        vy = pos1.y + r1.halfHeight - (pos2.y + r2.halfHeight);

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