import { Scene, Types } from "phaser";
import { Character, Player } from "../objects/charactors/player";
import { Mocker, Monster } from "../objects/monsters/mocker";

export class BlankScene extends Scene {
    cursors: Types.Input.Keyboard.CursorKeys;
    player: Character;
    monster: Monster;

    constructor() {
        super('Scene1');
        this.player = new Player(this, 600);
        this.monster = new Mocker(this, 100, this.player);
    }

    preload() {
        this.player.Preload();
        this.monster.Preload();
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.player.Create();
        this.monster.Create()
    }

    update(_: number, __: number): void {
        this.player.Update(this.cursors);
        this.monster.Update();
    }
}