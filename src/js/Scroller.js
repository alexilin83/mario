import * as PIXI from 'pixi.js';
import Sky from './Sky';
import Ground from './Ground';

export default class Scroller {
    constructor(game) {
        this.game = game;
        this.viewportX = 0;

        this.sky = new Sky(this);
        this.game.app.stage.addChild(this.sky);

        this.ground = new Ground(this);
        this.game.app.stage.addChild(this.ground);
    }
    setViewportX(viewportX) {
        this.viewportX = viewportX;
        this.sky.setViewportX(viewportX);
        this.ground.setViewportX(viewportX);
    }
    getViewportX() {
        return this.viewportX;
    }
    moveViewportXBy(units) {
        let newViewportX = this.viewportX + units;
        this.setViewportX(newViewportX);
    }
}