import { Scene, Types } from "phaser";
import { Character, Player } from "../objects/charactors/player";

export class BlankScene extends Scene {
    cursors: Types.Input.Keyboard.CursorKeys;
    player: Character;

    constructor() {
        super('Scene1');
        this.player = new Player(this, 600);
    }

    preload() {
        this.player.Preload();
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.player.Create();
    }

    update(_: number, __: number): void {
        this.player.Update(this.cursors);
    }
}