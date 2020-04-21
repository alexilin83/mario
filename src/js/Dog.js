import { AnimatedSprite } from 'pixi.js';

export default class Dog extends AnimatedSprite {
    constructor(game) {
        let sheet = game.loader.resources.dog.spritesheet;
        super(sheet.animations['sit']);
        this.animationSpeed = 0.2;
        this.position.x = 0;
        this.position.y = 0;
    }
}