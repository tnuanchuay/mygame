import { Physics, Scene, Types } from "phaser";
import { config } from "../../game";

export interface Character {
    Preload: () => void;
    Create: () => void;
    Object: () => void;
    Walk: (cursors: Types.Input.Keyboard.CursorKeys) => void;
}

export class Player implements Character {
    private scene: Scene;
    private sprit: Physics.Arcade.Sprite;
    private speed: number;

    constructor(scene: Scene, speed: number) {
        this.scene = scene;
        this.speed = speed;

    }

    Preload() {
        this.scene.load.image('hero', 'assets/hero/char1.png');
        this.scene.load.spritesheet('hero_sprit', 'assets/hero/player_idle48x48.png',{
            frameWidth: 48, frameHeight: 48
        });
    }

    Create() {
        const w = this.scene.game.canvas.width;
        const h = this.scene.game.canvas.height;
        this.sprit = this.scene.physics.add.sprite(w / 2, h / 2, 'hero_sprit');
        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNumbers('hero_sprit', {
                start: 0,
                end: 9,
            }),
            repeat: -1
        });
        this.sprit.anims.play('idle');
        this.sprit.setScale(1.5)
        this.sprit.setOrigin(0.5, 0.5)
        this.sprit.setCollideWorldBounds(true);
    }

    Object() {
        return this.sprit;
    }

    Walk(cursors: Types.Input.Keyboard.CursorKeys) {
        let x: number = 0;
        let y: number = 0;

        if (cursors.left.isDown) {
            x = x - this.speed;
        }
        if (cursors.right.isDown) {
            x = x + this.speed;
        }

        if (cursors.up.isDown) {
            y = y - this.speed;
        }
        if (cursors.down.isDown) {
            y = y + this.speed;
        }

        if (x > 0) {
            this.sprit.flipX = false;
        }
        if (x < 0) {
            this.sprit.flipX = true;
        }

        this.sprit.setVelocityX(x);
        this.sprit.setVelocityY(y);

    }
}