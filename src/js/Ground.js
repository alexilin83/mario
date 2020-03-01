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
        this.createTestMap();

        this.sliceWidth = 220;

        this.viewportX = 0;
        this.viewportSliceX = 0;
        this.viewportNumSlices = Math.ceil(scroller.game.w / this.sliceWidth) + 1;

        this.addNewSlices();
    }
    setViewportX(viewportX) {
        this.viewportX = this.checkViewportXBounds(viewportX);

        let prevViewportSliceX = this.viewportSliceX;
        this.viewportSliceX = Math.floor(this.viewportX / this.sliceWidth);

        this.addNewSlices();
    }
    checkViewportXBounds(viewportX) {
        let maxViewportX = (this.slices.length - this.viewportNumSlices) * this.sliceWidth;
        if (viewportX < 0) {
            viewportX = 0;
        } else if (viewportX >= maxViewportX) {
            viewportX = maxViewportX;
        }
        return viewportX;
    }
    addSlice(sliceType, y) {
        let slice = new GroundSlice(sliceType);
        this.slices.push(slice);
    }
    addNewSlices() {
        let firstX = -(this.viewportX % this.sliceWidth);
        for (let i = this.viewportSliceX, sliceIndex = 0; i < this.viewportSliceX + this.viewportNumSlices; i++, sliceIndex++) {
            let slice = this.slices[i];
            if (slice.sprite == null && slice.type != this.sliceTypes[1]) {
                slice.sprite = this.borrowGroundSprite();
                slice.sprite.position.x = firstX + (sliceIndex * this.sliceWidth);
                slice.sprite.position.y = this.scroller.game.h - 230;
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
    createTestWallSpan() {
        this.addSlice(this.sliceTypes[0]);
        this.addSlice(this.sliceTypes[0]);
        this.addSlice(this.sliceTypes[0]);
        this.addSlice(this.sliceTypes[0]);
    };
    createTestGap() {
        this.addSlice(this.sliceTypes[1]);
    };
    createTestMap() {
        for (var i = 0; i < 10; i++) {
            this.createTestWallSpan();
            this.createTestGap();
            this.createTestWallSpan();
            this.createTestGap();
        }
    };
}