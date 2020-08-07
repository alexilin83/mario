import { Container } from 'pixi.js';
import Enemy from './Enemy';
import Dog from './Dog';
import Salute from './Salute';
import Cake from './Cake';

export default class Objects extends Container {
    constructor(game) {
        super();

        this.game = game;
     
        this.viewportX = 0;

        this.enemies = [];
        this.enemiesAmount = 10;

        this.salutes = [
            {
                x: (this.game.ground.slices.length - 2) * this.game.ground.sliceWidth - (game.w * 90 / 100),
                y: game.h * 5 / 100,
                sprite: null
            },
            {
                x: (this.game.ground.slices.length - 2) * this.game.ground.sliceWidth - (game.w * 20 / 100),
                y: game.h * 12 / 100,
                sprite: null
            },
            {
                x: (this.game.ground.slices.length - 2) * this.game.ground.sliceWidth - (game.w * 55 / 100),
                y: game.h * 30 / 100,
                sprite: null
            },
            {
                x: (this.game.ground.slices.length - 2) * this.game.ground.sliceWidth - (game.w * 75 / 100),
                y: game.h * 55 / 100,
                sprite: null
            },
            {
                x: (this.game.ground.slices.length - 2) * this.game.ground.sliceWidth - (game.w * 35 / 100),
                y: game.h * 60 / 100,
                sprite: null
            }
        ];

        for (let i = 0; i < this.enemiesAmount; i++) {
            let enemy = new Enemy(this.game);
            this.enemies.push(enemy);
            this.addChild(enemy);
            enemy.play();
            
            let index = Math.floor(Math.random() * (this.game.ground.slices.length - 1)) + 1;
            
            let slice = this.game.ground.slices[index];
            enemy.x = index * this.game.ground.sliceWidth;
            enemy.y = this.game.h - (slice.y + enemy.height);
        }

        this.dog = new Dog(this.game);
        this.addChild(this.dog);
        this.dog.x = (this.game.ground.slices.length - 3) * this.game.ground.sliceWidth;
        this.dog.y = this.game.h - (this.game.ground.slices[this.game.ground.slices.length - 3].y + this.dog.height);
        this.dog.play();

        for (let i = 0; i < this.salutes.length; i++) {
            let salute = new Salute(this.game);
            this.salutes[i].sprite = salute;
            this.addChild(salute);
            salute.x =  this.salutes[i].x;
            salute.y = this.salutes[i].y;
            salute.visible = false;
        }

        this.cake = new Cake(this.game);
        this.addChild(this.cake);
        this.cake.x = (this.game.ground.slices.length - 3) * this.game.ground.sliceWidth - this.cake.width;
        this.cake.y = this.game.h - (this.game.ground.slices[this.game.ground.slices.length - 3].y + this.cake.height);
        this.cake.play();
    }
    update() {
        this.enemies.forEach((enemy) => {
            let position = enemy.getGlobalPosition();

            if (enemy.isDead) {
                enemy.stop();
                enemy.anchor.set(0, -1);
                enemy.transform.scale.y = 0.5;
            } else {
                if (position.x < this.game.w + enemy.width) {
                    enemy.vx = -enemy.speed;
                    enemy.vy += this.game.gravity;
                    enemy.isOnGround = false;
        
                    this.game.ground.slices.forEach((slice) => {
                        let sprite = slice.sprite;
        
                        if (sprite) {
                            let collideDirEnemy = this.game.checkCollide(enemy, sprite);
                            if (collideDirEnemy) {
                                if (collideDirEnemy === 'left' || collideDirEnemy === 'right') {
                                    enemy.vx = 0;
                                } else if (collideDirEnemy === 'down') {
                                    enemy.isOnGround = true;
                                }
                            }
                        }
                    });
        
                    if (enemy.isOnGround) {
                        enemy.vy = 0;
                    }
                    enemy.x += enemy.vx;
                    enemy.y += enemy.vy;
                }
            }

        });

        this.removeEnemies();

        let collideDirCake = this.game.checkCollide(this.cake, this.game.player);
        if (collideDirCake && !this.game.isComplete ) {
            for (let i = 0; i < this.salutes.length; i++) {
                this.salutes[i].sprite.visible = true;
                this.salutes[i].sprite.play();

                this.game.loader.resources.main.sound.stop();
                this.game.loader.resources.happy.sound.volume = 0.1;
                this.game.loader.resources.happy.sound.play({
                    loop: true
                });

                this.game.completeMessage.text = 'С днем рожденья!';
                this.game.completeMessage.visible = true;

                this.game.isComplete = true;
            }
        }
    }
    setViewportX(newViewportX) {
        let distanceTravelled = newViewportX - this.viewportX;
        this.viewportX = newViewportX;
        this.x -= distanceTravelled;
    }
    removeEnemies() {
        let enemies = this.enemies.filter(enemy => {
            let position = enemy.getGlobalPosition();
            if ((position.x > 0 - enemy.width) && (position.y < this.game.h) && !enemy.isDead) {
                return true;
            } else {
                setTimeout(() => {
                    this.removeChild(enemy);
                }, 200)
                return false;
            }
        });
        this.enemies = enemies;
    }
}