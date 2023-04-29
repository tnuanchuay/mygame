import { Physics, Scene, Types } from "phaser";
import { config } from "../../game";
import { PlayerState } from "./playerState";

export interface Character {
    Preload: () => void;
    Create: () => void;
    Object: () => void;
    Update: (cursors: Types.Input.Keyboard.CursorKeys) => void;
}

export class Player implements Character {
    private scene: Scene;
    private sprit: Physics.Arcade.Sprite;
    private speed: number;
    private state: PlayerState;

    constructor(scene: Scene, speed: number) {
        this.scene = scene;
        this.speed = speed;
        this.state = PlayerState.Idle;
    }

    Preload() {
        this.scene.load.spritesheet('hero_idle', 'assets/hero/player_idle48x48.png', {
            frameWidth: 48, frameHeight: 48,
        });

        this.scene.load.spritesheet('hero_run', 'assets/hero/player_run48x48.png', {
            frameWidth: 48, frameHeight: 48,
        })
    }

    Create() {
        const w = this.scene.game.canvas.width;
        const h = this.scene.game.canvas.height;
        this.sprit = this.scene.physics.add.sprite(w / 2, h / 2, 'hero_idle');

        this.scene.anims.create({
            key: 'hero_idle',
            frames: this.scene.anims.generateFrameNumbers('hero_idle', {
                start: 0,
                end: 9,
            }),
            repeat: -1
        });

        this.scene.anims.create({
            key: 'hero_run',
            frames: this.scene.anims.generateFrameNumbers('hero_run', {
                start: 0,
                end: 7,
            }),
            repeat: -1
        });

        this.sprit.anims.play('hero_idle');

        this.sprit.setScale(1.5)
        this.sprit.setOrigin(0.5, 0.5)
        this.sprit.setCollideWorldBounds(true);
    }

    Object() {
        return this.sprit;
    }

    Update(cursors: Types.Input.Keyboard.CursorKeys) {
        const x = this.getX(cursors)
        const y = this.getY(cursors)

        this.setAnimation(x, y);
        this.handleFlip(x);

        this.sprit.setVelocityX(x);
        this.sprit.setVelocityY(y);

    }

    handleFlip(x: number) {
        if (x > 0) {
            this.sprit.flipX = false;
        }
        if (x < 0) {
            this.sprit.flipX = true;
        }
    }

    getX(cursors: Types.Input.Keyboard.CursorKeys): number {
        let x = 0;
        if (cursors.left.isDown) {
            x = x - this.speed;
        }
        if (cursors.right.isDown) {
            x = x + this.speed;
        }

        return x;
    }

    getY(cursors: Types.Input.Keyboard.CursorKeys): number {
        let y = 0;
        if (cursors.up.isDown) {
            y = y - this.speed;
        }
        if (cursors.down.isDown) {
            y = y + this.speed;
        }

        return y;
    }

    setAnimation(x: number, y: number) {
        if (x === 0 && y === 0 && this.state != PlayerState.Idle) {
            this.sprit.anims.play('hero_idle');
            this.state = PlayerState.Idle;
        } else if ((x != 0 || y != 0) && this.state != PlayerState.Run) {
            this.sprit.anims.play('hero_run');
            this.state = PlayerState.Run
        }
    }
}