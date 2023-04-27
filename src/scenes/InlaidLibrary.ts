import { Scene, Types } from "phaser";
import { Player } from "../objects/charactors/hero";

export class InlaidLibraryBattleScene extends Scene {
    cursors: Types.Input.Keyboard.CursorKeys;
    player: Player;

    constructor() {
        super('Inlaid Library');
    }

    preload() {
        this.load.image('hero', 'assets/hero/char1.png');
    }

    create() {
        this.player = new Player(this, 400);
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(_: number, __: number): void {
        this.player.walk(this.cursors);
    }
}