import { TilingSprite, Texture } from 'pixi.js';

export default class Sky extends TilingSprite {
    constructor(game) {
        let texture = new Texture(game.loader.resources.sky.texture);
        super(texture, game.w, 264);
        this.position.y = 50;
        this.viewportX = 0;
        this.deltaX = 0.4;
    }
    update() {
        this.tilePosition.x -= 0.5;
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