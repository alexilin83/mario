import * as PIXI from 'pixi.js';

export default class GroundSpritesPool {
    constructor(scroller) {
        this.scroller = scroller;
        this.ground = [];
        this.createGround();
    }
    createGround() {
        this.addGroundSprites(4, 'ground1.png');
        this.addGroundSprites(4, 'ground2.png');
        this.addGroundSprites(4, 'ground3.png');
        this.addGroundSprites(4, 'ground4.png');
        this.scroller.game.shuffle(this.ground);
    }
    addGroundSprites(amount, frameId) {
        for (let i = 0; i < amount; i++) {
            let sprite = new PIXI.Sprite(this.scroller.game.loader.resources.ground.textures[frameId]);
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