import * as PIXI from 'pixi.js';

export default class Cloud extends PIXI.TilingSprite {
    constructor(...args) {
        super(...args);
        this.viewportX = 0;
    }
    moveViewportX(units) {
        this.viewportX += units;
        this.tilePosition.x = this.viewportX;
    }
}