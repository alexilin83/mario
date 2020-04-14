import { TilingSprite, Texture } from 'pixi.js';

export default class Trees extends TilingSprite {
    constructor(game) {
        let texture = new Texture(game.loader.resources.trees.texture);
        super(texture, game.w, 516);
        this.position.y = game.h - 516;
        this.viewportX = 0;
        this.deltaX = 0.5;
    }
    setViewportX(newViewportX) {
        let distanceTravelled = newViewportX - this.viewportX;
        this.viewportX = newViewportX;
        this.tilePosition.x -= (distanceTravelled * this.deltaX);
    }
}