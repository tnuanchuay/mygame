import {Physics, Scene, Types} from "phaser";
import {LoadPlayerAnimation, LoadPlayerSpriteSheet} from "./playerAssetsUtils";
import {PlayerData} from "./type";

export interface ICharacter {
    Create: () => void;
    Object: () => Physics.Arcade.Sprite;
    Update: () => void;
    // SetPosition: (x: number)
}

export class Player implements ICharacter {
    private readonly playerName: string;
    private readonly x: number;
    private readonly y: number;

    private scene: Scene;
    private sprite: Physics.Arcade.Sprite;

    constructor(scene: Scene, playerData: PlayerData) {
        this.scene = scene;
        this.playerName = playerData.playerName;
        this.x = playerData.x;
        this.y = playerData.y;
    }

    public Create(): void {
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, 'hero_idle');
        this.sprite.setData("type", "other_player");

        this.sprite.anims.play('hero_idle');
        this.sprite.setScale(3);
        this.sprite.setOrigin(0.5, 0.5);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setSize(22, 32, true);
    }

    public Object(): Phaser.Physics.Arcade.Sprite {
        return this.sprite;
    }


    Update(): void {

    }
}