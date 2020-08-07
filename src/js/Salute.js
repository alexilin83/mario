import { AnimatedSprite } from 'pixi.js';

export default class Salute extends AnimatedSprite {
    constructor(game) {
        let sheet = game.loader.resources.salute.spritesheet;
        super(sheet.animations['fire']);
        this.animationSpeed = 0.2;
        this.position.x = 0;
        this.position.y = 0;
    }
}