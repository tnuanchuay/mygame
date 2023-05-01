import { Physics, Scene, Types } from "phaser";
import { Character } from './../charactors/player';
import { getRandomInt } from './../../utils/random';
import { PlayerState } from "../charactors/playerState";

export interface Monster {
    Preload: () => void;
    Create: () => void;
    Object: () => void;
    Update: () => void;
    IsDeath: () => boolean;
}

export class Mocker implements Monster {
    private scene: Scene;
    private sprit: Physics.Arcade.Sprite;
    private speed: number;
    private player: Character;
    private isDeath: boolean;
    private doneDeath: boolean;

    constructor(scene: Scene, speed: number, player: Character) {
        this.scene = scene;
        this.speed = speed;
        this.player = player;
    }

    IsDeath = (): boolean => this.doneDeath;

    Preload() {
        this.scene.load.spritesheet('mocker_walk', 'assets/monsters/mocker_walk48x48.png', {
            frameWidth: 48, frameHeight: 48,
        });
        this.scene.load.spritesheet('mocker_death', 'assets/monsters/mocker_death64x64.png', {
            frameWidth: 64, frameHeight: 64,
        })

        this.isDeath = false;
        this.doneDeath = false;
    }

    getSpawnPosition(): {x: number, y: number} {
        const w = this.scene.game.canvas.width;
        const h = this.scene.game.canvas.height;
        return { x: getRandomInt(w), y: getRandomInt(h) }
    }

    Create() {
        const {x, y} = this.getSpawnPosition();
        this.sprit = this.scene.physics.add.sprite(x, y, 'mocker_walk');
        this.scene.anims.create({
            key: 'mocker_walk',
            frames: this.scene.anims.generateFrameNumbers('mocker_walk', {
                start: 0,
                end: 7,
            }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'mocker_death',
            frames: this.scene.anims.generateFrameNumbers('mocker_death', {
                start: 0,
                end: 9
            }),
            frameRate: 10,
        })

        this.sprit.anims.play('mocker_walk');
        this.sprit.setScale(3);
        this.sprit.setOrigin(0.5, 0.5);
        this.sprit.setCollideWorldBounds(true);
        this.sprit.body.setSize(22, 34);
        this.scene.physics.add.collider(this.sprit, this.player.Object(), (obj1, obj2) => {
            if(obj2.getData("type") === "player" && obj2.state === PlayerState.Attack){
                this.isDeath = true;
            }
        });

        this.sprit.on('animationcomplete', () => {
            if(this.isDeath){
                this.sprit.destroy();
                this.doneDeath = true;
            }
        });
    }

    Object() {
        return this.sprit;
    }

    Update() {
        if(this.doneDeath){
            return
        }

        if(this.isDeath){
            this.sprit.anims.play('mocker_death', true);
            this.sprit.setVelocityX(0);
            this.sprit.setVelocityY(0);
            return
        }

        const player = this.player.Object();
        const playerX = player.x;
        const playerY = player.y;

        const x = this.sprit.x;
        const y = this.sprit.y;

        const xDir = Math.abs(playerX - x) > 1 ? (playerX > x ? 1 : -1) : 0;
        const yDir = Math.abs(playerY - y) > 1 ? (playerY > y ? 1 : -1) : 0;

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