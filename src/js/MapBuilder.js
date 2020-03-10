export default class MapBuilder {
    constructor(ground) {
        this.ground = ground;
        this.groundHeights = [230, 180];
        this.createMap();
    }
    createMap() {
        this.createGroundSpan(0, 5);
        this.createGroundSpan(1, 4);
        this.createGap(1);
        this.createGroundSpan(0, 4);
        this.createGap(2);
        this.createGroundSpan(1, 2);
        this.createGap(1);
        this.createGroundSpan(0, 4);

        this.ground.addNewSlices();
    }
    createGap(spanLength) {
        for (let i = 0; i < spanLength; i++) {
            this.ground.addSlice(this.ground.sliceTypes[1]);
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