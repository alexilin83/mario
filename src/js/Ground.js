import { Container, Sprite } from 'pixi.js';
import GroundSpritesPool from './GroundSpritesPool';

class GroundSlice {
    constructor(type, y) {
        this.type = type;
        this.y = y;
        this.sprite = null;
    }   
}

export default class Ground extends Container {
    constructor(game) {
        super();

        this.game = game;
        this.pool = new GroundSpritesPool(this.game);

        this.slices = [];
        this.sliceTypes = ['grass', 'gap'];

        this.sliceWidth = 220;

        this.groundHeights = [170, 120, 0];

        this.viewportX = 0;
        this.viewportSliceX = 0;
        this.viewportNumSlices = Math.ceil(this.game.w / this.sliceWidth) + 1;

        this.createGround();
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
    addNewSlices() {
        let firstX = -(this.viewportX % this.sliceWidth);
        for (let i = this.viewportSliceX, sliceIndex = 0; i < this.viewportSliceX + this.viewportNumSlices; i++, sliceIndex++) {
            let slice = this.slices[i];
            if (slice.sprite == null) {
             
                if (slice.type != this.sliceTypes[1]) {
                    slice.sprite = this.borrowGroundSprite();
                } else {
                    slice.sprite = new Sprite(this.game.loader.resources.ground.textures['ground1.png']);
                    slice.sprite.alpha = 0;
                }

                slice.sprite.position.x = firstX + (sliceIndex * this.sliceWidth);
                slice.sprite.position.y = slice.y ? this.game.h - slice.y : this.game.h + 300;

                this.addChild(slice.sprite);
            }
             else if (slice.sprite != null) {
                slice.sprite.position.x = firstX + (sliceIndex * this.sliceWidth);
            }
        }
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
    borrowGroundSprite() {
        return this.pool.borrowGround();
    }
    returnGroundSprite(sliceSprite) {
        return this.pool.returnGround(sliceSprite);
    }

    createGround() {
        this.createGroundSpan(1, 2);
        this.createGroundSpan(0, 4);
        this.createGap(1);
        this.createGroundSpan(0, 4);
        this.createGap(1);
        this.createGroundSpan(1, 2);
        this.createGap(1);
        this.createGroundSpan(0, 4);

        this.addNewSlices();
    }
    createGap(spanLength) {
        let y = this.groundHeights[2];
        for (let i = 0; i < spanLength; i++) {
            this.addSlice(this.sliceTypes[1], y);
        }
    }
    createGroundSpan(heightIndex, spanLength) {
        this.addGround(heightIndex, spanLength);
    }
    addGround(heightIndex, spanLength) {
        let y = this.groundHeights[heightIndex];
        for (let i = 0; i < spanLength; i++) {
            this.addSlice(this.sliceTypes[0], y);
        }
    }
}