import { AnimatedSprite } from 'pixi.js';

export default class Enemy extends AnimatedSprite {
    constructor(game) {
        let sheet = game.loader.resources.enemy.spritesheet;
        super(sheet.animations['walk']);
        this.animationSpeed = 0.2;
        this.position.x = 0;
        this.position.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.speed = 1;
        this.isOnGround = false;
        this.isHitted = false;
    }
}