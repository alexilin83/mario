export default class MapBuilder {
    constructor(ground) {
        this.ground = ground;
        this.groundHeights = [170, 120, 0];
        this.createMap();
    }
    createMap() {
        this.createGroundSpan(1, 2);
        this.createGroundSpan(0, 4);
        this.createGap(1);
        this.createGroundSpan(0, 4);
        this.createGap(1);
        this.createGroundSpan(1, 2);
        this.createGap(1);
        this.createGroundSpan(0, 4);

        this.ground.addNewSlices();
    }
    createGap(spanLength) {
        let y = this.groundHeights[2];
        for (let i = 0; i < spanLength; i++) {
            this.ground.addSlice(this.ground.sliceTypes[1], y);
        }
    }
    createGroundSpan(heightIndex, spanLength) {
        this.addGround(heightIndex, spanLength);
    }
    addGround(heightIndex, spanLength) {
        let y = this.groundHeights[heightIndex];
        for (let i = 0; i < spanLength; i++) {
            this.ground.addSlice(this.ground.sliceTypes[0], y);
        }
    }
}