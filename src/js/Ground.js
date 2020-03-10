import * as PIXI from 'pixi.js';
import GroundSpritesPool from './GroundSpritesPool';
import GroundSlice from './GroundSlice';

export default class Ground extends PIXI.Container {
    constructor(scroller) {
        super();

        this.scroller = scroller;
        this.pool = new GroundSpritesPool(scroller);

        this.slices = [];
        this.sliceTypes = ['grass', 'gap'];

        this.sliceWidth = 220;

        this.viewportX = 0;
        this.viewportSliceX = 0;
        this.viewportNumSlices = Math.ceil(scroller.game.w / this.sliceWidth) + 1;
    }
    setViewportX(viewportX) {
        this.viewportX = this.checkViewportXBounds(viewportX);

        let prevViewportSliceX = this.viewportSliceX;
        this.viewportSliceX = Math.floor(this.viewportX / this.sliceWidth);

        this.removeOldSlices(prevViewportSliceX);
        this.addNewSlices();
    }
    checkViewportXBounds(viewportX) {
        let maxViewportX = (this.slices.length - this.viewportNumSlices) * this.sliceWidth;
        if (viewportX < 0) {
            viewportX = 0;
        } else if (viewportX > maxViewportX) {
            viewportX = maxViewportX;
        }
        return viewportX;
    }
    addSlice(sliceType, y) {
        let slice = new GroundSlice(sliceType, y);
        this.slices.push(slice);
    }
    removeOldSlices(prevViewportSliceX) {
        let numOldSlices = this.viewportSliceX - prevViewportSliceX;
        if (numOldSlices > this.viewportNumSlices) {
            numOldSlices = this.viewportNumSlices;
        }
        for (let i = prevViewportSliceX; i < prevViewportSliceX + numOldSlices; i++) {
            let slice = this.slices[i];
            if (slice.sprite != null) {
                this.returnGroundSprite(slice.sprite);
                this.removeChild(slice.sprite);
                slice.sprite = null;
            }
        }
    }
    addNewSlices() {
        let firstX = -(this.viewportX % this.sliceWidth);
        for (let i = this.viewportSliceX, sliceIndex = 0; i < this.viewportSliceX + this.viewportNumSlices; i++, sliceIndex++) {
            let slice = this.slices[i];
            if (slice.sprite == null && slice.type != this.sliceTypes[1]) {
                
                slice.sprite = this.borrowGroundSprite();

                slice.sprite.position.x = firstX + (sliceIndex * this.sliceWidth);
                slice.sprite.position.y = this.scroller.game.h - slice.y;

                this.addChild(slice.sprite);
            } else if (slice.sprite != null) {
                slice.sprite.position.x = firstX + (sliceIndex * this.sliceWidth);
            }
        }
    }
    borrowGroundSprite() {
        return this.pool.borrowGround();
    }
    returnGroundSprite(sliceSprite) {
        return this.pool.returnGround(sliceSprite);
    }
}