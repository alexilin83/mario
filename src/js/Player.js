import * as PIXI from 'pixi.js';

export default class Player extends PIXI.AnimatedSprite {
    constructor(game) {
        let sheet = game.loader.resources.player.spritesheet;
        super(sheet.animations['walk']);
        this.game = game;
        this.position.x = game.w / 2 - 15;
        this.position.y = game.h - 230;
        this.animationSpeed = 0.2;
        this.vx = 0;
    }
}