import Sky from './Sky';
import Ground from './Ground';
import MapBuilder from './MapBuilder';

export default class Scroller {
    constructor(game) {
        this.game = game;
        this.viewportX = 0;

        this.sky = new Sky(this);
        this.game.app.stage.addChild(this.sky);

        this.ground = new Ground(this);
        this.game.app.stage.addChild(this.ground);

        this.mapBuilder = new MapBuilder(this.ground);
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