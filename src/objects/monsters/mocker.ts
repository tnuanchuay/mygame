import { Physics, Scene, Types } from "phaser";
import { Character } from './../charactors/player';

export interface Monster {
    Preload: () => void;
    Create: () => void;
    Object: () => void;
    Update: () => void;
}

export class Mocker implements Monster {
    private scene: Scene;
    private sprit: Physics.Arcade.Sprite;
    private speed: number;
    private player: Character;

    constructor(scene: Scene, speed: number, player: Character) {
        this.scene = scene;
        this.speed = speed;
        this.player = player;
    }

    Preload() {
        this.scene.load.spritesheet('mocker_walk', 'assets/monsters/mocker_walk48x48.png', {
            frameWidth: 48, frameHeight: 48,
        });
    }

    Create() {
        this.sprit = this.scene.physics.add.sprite(0, 0, 'mocker_walk');

        this.scene.anims.create({
            key: 'mocker_walk',
            frames: this.scene.anims.generateFrameNumbers('mocker_walk', {
                start: 0,
                end: 7,
            }),
            frameRate: 10,
            repeat: -1
        });

        this.sprit.anims.play('mocker_walk');
        this.sprit.setScale(3);
        this.sprit.setOrigin(0.5, 0.5);
        this.sprit.setCollideWorldBounds(true);
    }

    Object() {
        return this.sprit;
    }

    Update() {
        const player = this.player.Object();
        const playerX = player.x;
        const playerY = player.y;

        const x = this.sprit.x;
        const y = this.sprit.y;

        const xDir = playerX > x ? 1 : -1;
        const yDir = playerY > y ? 1 : -1;

        if(xDir > 0){
            this.sprit.flipX = false;
        }

        if(xDir < 0){
            this.sprit.flipX = true;
        }

        this.sprit.setVelocityX(xDir * this.speed);
        this.sprit.setVelocityY(yDir * this.speed);
    }
}