import { Container } from 'pixi.js';
import Enemy from './Enemy';

export default class Objects extends Container {
    constructor(game) {
        super();

        this.game = game;
     
        this.viewportX = 0;

        this.enemies = [];
        this.enemiesAmount = 10;

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
    }
    update() {
        this.enemies.forEach((enemy) => {
            let position = enemy.getGlobalPosition();

            if (enemy.isDead) {
                enemy.stop();
                enemy.rotation = 0;
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