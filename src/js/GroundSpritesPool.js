import { Sprite } from 'pixi.js';

export default class GroundSpritesPool {
    constructor(game) {
        this.game = game;
        this.ground = [];
        this.createGround();
    }
    createGround() {
        this.addGroundSprites(4, 'ground1.png');
        this.addGroundSprites(4, 'ground2.png');
        this.addGroundSprites(4, 'ground3.png');
        this.addGroundSprites(4, 'ground4.png');
        this.game.shuffle(this.ground);
    }
    addGroundSprites(amount, frameId) {
        for (let i = 0; i < amount; i++) {
            let sprite = new Sprite(this.game.loader.resources.ground.textures[frameId]);
            this.ground.push(sprite);
        }
    }
    borrowGround() {
        return this.ground.shift();
    }
    returnGround(sprite) {
        this.ground.push(sprite);
    }
}