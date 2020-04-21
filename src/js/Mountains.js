import { TilingSprite, Texture } from 'pixi.js';

export default class Mountains extends TilingSprite {
    constructor(game) {
        let texture = new Texture(game.loader.resources.mountains.texture);
        super(texture, game.w, 844);
        this.position.y = game.h - 844;
        this.viewportX = 0;
        this.deltaX = 0.4;
    }
    setViewportX(newViewportX) {
        let distanceTravelled = newViewportX - this.viewportX;
        this.viewportX = newViewportX;
        this.tilePosition.x -= (distanceTravelled * this.deltaX);
    }
    clearViewportX() {
        this.viewportX = 0;
        this.tilePosition.x = 0;
    }
}