import * as PIXI from 'pixi.js';

export default class Player extends PIXI.AnimatedSprite {
    constructor(game) {
        let sheet = game.loader.resources.player.spritesheet;
        super(sheet.animations['walk']);
        this.game = game;
        this.animationSpeed = 0.2;
        this.position.x = 0;
        this.position.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.isJumping = false;
        this.isFalling = false;
        this.isOnGround = true;
        this.jumpTreshold = 300;
    }
}