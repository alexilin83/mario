import * as PIXI from 'pixi.js';

export default class Player extends PIXI.TilingSprite {
    constructor(game) {
        let texture = game.loader.resources.player.textures['player1.png'];
        super(texture, 30, 59);
        this.game = game;
        this.position.x = 100;
        this.position.y = game.h - 230;
        this.vx = 0;
    }
    update() {
        this.tilePosition.x += 30;
    }
}