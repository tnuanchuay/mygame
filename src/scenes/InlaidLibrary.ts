import { Scene, Types } from "phaser";
import { Player } from "../objects/charactors/hero";

export class InlaidLibraryBattleScene extends Scene {
    cursors: Types.Input.Keyboard.CursorKeys;
    player: Player;

    constructor() {
        super('Inlaid Library');
    }

    preload() {
        // this.load.setBaseURL('http://labs.phaser.io');
        // this.load.image('hero', 'assets/sprites/phaser3-logo.png')
        this.load.image('hero', 'assets/hero/char1.png');
    }

    create() {
        this.player = new Player(this);
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(_: number, __: number): void {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-260);
        }
        if (this.cursors.right.isDown) {
            this.player.setVelocityX(260);
        }
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-260);
        }
        if (this.cursors.down.isDown) {
            this.player.setVelocityY(260);
        }
        if(this.cursors.down.isUp && this.cursors.up.isUp && this.cursors.left.isUp && this.cursors.right.isUp){
            this.player.set0Velocity();
        }
    }
}