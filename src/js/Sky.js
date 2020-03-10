import * as PIXI from 'pixi.js';

export default class Sky extends PIXI.TilingSprite {
    constructor(scroller) {
        let textureSky = new PIXI.Texture(scroller.game.loader.resources.sky.texture);
        super(textureSky, scroller.game.w, 264);
        this.scroller = scroller;
        this.position.y = 50;
        this.viewportX = 0;
        this.deltaX = 0.4;
    }
    setViewportX(newViewportX) {
        let distanceTravelled = newViewportX - this.viewportX;
        this.viewportX = newViewportX;
        this.tilePosition.x -= (distanceTravelled * this.deltaX);
    }
}