import { Physics, Scene, Types } from "phaser";
import { IPlayableCharacter } from '../player/playablePlayer';
import { getRandomInt } from './../../utils/math';
import { PlayerState } from "../player/playerState";

export interface Monster {
    Preload: () => void;
    Create: () => void;
    Object: () => void;
    Update: () => void;
    IsDeath: () => boolean;
}

export class Mocker implements Monster {
    private readonly speed: number;

    private scene: Scene;
    private sprite: Physics.Arcade.Sprite;
    private player: IPlayableCharacter;
    private isDeath: boolean;
    private doneDeath: boolean;

    constructor(scene: Scene, speed: number, player: IPlayableCharacter) {
        this.scene = scene;
        this.speed = speed;
        this.player = player;
    }

    IsDeath = (): boolean => this.doneDeath;

    Preload = () => {
        this.scene.load.spritesheet('mocker_walk', 'assets/monsters/mocker_walk48x48.png', {
            frameWidth: 48, frameHeight: 48,
        });
        this.scene.load.spritesheet('mocker_death', 'assets/monsters/mocker_death64x64.png', {
            frameWidth: 64, frameHeight: 64,
        })

        this.isDeath = false;
        this.doneDeath = false;
    }

    getSpawnPosition = (): { x: number, y: number } => {
        const w = this.scene.game.canvas.width;
        const h = this.scene.game.canvas.height;
        return { x: getRandomInt(w), y: getRandomInt(h) }
    }

    createAnime = () => {
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
        });
    }

    createCollision = () => {
        this.scene.physics.add.collider(this.sprite, this.player.Object(), (obj1, obj2) => {
            if (obj2.getData("type") === "player" && obj2.state === PlayerState.Attack) {
                this.isDeath = true;
            }
        });
    }

    handleOnAnimationComplete = () => {
        this.sprite.on('animationcomplete', () => {
            if (this.isDeath) {
                this.sprite.destroy();
                this.doneDeath = true;
            }
        });
    }

    Create = () => {
        const { x, y } = this.getSpawnPosition();
        this.sprite = this.scene.physics.add.sprite(x, y, 'mocker_walk');

        this.createAnime();

        this.sprite.anims.play('mocker_walk');
        this.sprite.setScale(3);
        this.sprite.setOrigin(0.5, 0.5);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setSize(22, 34, true);
        
        this.createCollision();
        this.handleOnAnimationComplete();
    }

    Object = () => {
        return this.sprite;
    }

    Update = () => {
        if (this.doneDeath) {
            return
        }

        if (this.isDeath) {
            this.handleDeath();
            return
        }

        const { x, y } = this.player.Object();

        this.handleFlip(x);
        this.move(x, y);
    }

    move = (playerX: number, playerY: number) => {
        const x = this.sprite.x;
        const y = this.sprite.y;

        const xDir = Math.abs(playerX - x) > 1 ? (playerX > x ? 1 : -1) : 0;
        const yDir = Math.abs(playerY - y) > 1 ? (playerY > y ? 1 : -1) : 0;

        this.sprite.setVelocityX(xDir * this.speed);
        this.sprite.setVelocityY(yDir * this.speed);
    }

    handleFlip = (playerX: number) => {
        const x = this.sprite.x;

        const xDir = Math.abs(playerX - x) > 1 ? (playerX > x ? 1 : -1) : 0;

        if (xDir > 0) {
            this.sprite.flipX = false;
        }

        if (xDir < 0) {
            this.sprite.flipX = true;
        }
    }

    handleDeath = () => {
        this.sprite.anims.play('mocker_death', true);
        this.sprite.setVelocityX(0);
        this.sprite.setVelocityY(0);
        this.sprite.body.setSize(22, 34, true);
    }
}