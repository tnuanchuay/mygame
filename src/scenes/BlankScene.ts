import { Scene, Types } from "phaser";
import { Character, Player } from "../objects/charactors/player";
import { Mocker, Monster } from "../objects/monsters/mocker";

export class BlankScene extends Scene {
    cursors: Types.Input.Keyboard.CursorKeys;
    player: Character;
    monster: Monster[];

    constructor() {
        super('Scene1');
        this.player = new Player(this, 600);
        this.monster = [];
        this.monster.push(new Mocker(this, 100, this.player));
        // this.monster.push(new Mocker(this, 100, this.player));
        // this.monster.push(new Mocker(this, 100, this.player));
        // this.monster.push(new Mocker(this, 100, this.player));
        // this.monster.push(new Mocker(this, 100, this.player));
        // this.monster.push(new Mocker(this, 100, this.player));
        // this.monster.push(new Mocker(this, 100, this.player));
        // this.monster.push(new Mocker(this, 100, this.player));
        // this.monster.push(new Mocker(this, 100, this.player));
    }

    preload() {
        this.player.Preload();
        this.monster.forEach(i => i.Preload());
        this.monster[0].Preload();
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.player.Create();
        this.monster.forEach(i => i.Create());
    }

    update(_: number, __: number): void {
        this.player.Update(this.cursors);
        this.monster.forEach(i => i.Update());
        this.removeDeathMonster();
        this.addMoreMonsterIfThereIsNoOne();
    }

    removeDeathMonster() {
        this.monster = this.monster.filter(m => !m.IsDeath());
    }

    addMoreMonsterIfThereIsNoOne(){
        if(this.monster.length === 0){
            var m = new Mocker(this, 100, this.player);
            m.Preload();
            m.Create();
            this.monster.push(m);
        }
    }
}