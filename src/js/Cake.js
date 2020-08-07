import { AnimatedSprite } from 'pixi.js';

export default class Cake extends AnimatedSprite {
    constructor(game) {
        let sheet = game.loader.resources.cake.spritesheet;
        super(sheet.animations['cake']);
        this.animationSpeed = 0.2;
        this.position.x = 0;
        this.position.y = 0;
        this.transform.scale.x = 0.2;
        this.transform.scale.y = 0.2;
    }
}