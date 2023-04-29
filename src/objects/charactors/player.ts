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

    constructor(scene: Scene, speed: number) {
        this.scene = scene;
        this.speed = speed;
    }

    Preload() {
        this.scene.load.spritesheet('hero_idle', 'assets/hero/player_idle48x48.png', {
            frameWidth: 48, frameHeight: 48,
        });

        this.scene.load.spritesheet('hero_run', 'assets/hero/player_run48x48.png', {
            frameWidth: 48, frameHeight: 48,
        });

        this.scene.load.spritesheet('hero_sword_atk', 'assets/hero/player_swordatk64x64.png', {
            frameWidth: 64, frameHeight: 64,
        });
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
            repeat: -1,
        });

        this.scene.anims.create({
            key: 'hero_run',
            frames: this.scene.anims.generateFrameNumbers('hero_run', {
                start: 0,
                end: 7,
            }),
            repeat: -1,
        });

        this.scene.anims.create({
            key: 'hero_sword_atk',
            frames: this.scene.anims.generateFrameNames('hero_sword_atk', {
                start: 0,
                end: 5,
            }),
        });

        this.sprit.anims.play('hero_idle');
        this.sprit.setScale(3);
        this.sprit.setOrigin(0.5, 0.5);
        this.sprit.setCollideWorldBounds(true);

        this.sprit.on('animationcomplete', () => {
            if(this.sprit.state === PlayerState.Attack){
                this.sprit.setState(PlayerState.Idle);
            }
        });
    }

    Object() {
        return this.sprit;
    }

    Update(cursors: Types.Input.Keyboard.CursorKeys) {
        const x = this.getX(cursors);
        const y = this.getY(cursors);

        if (cursors.space.isDown && this.sprit.state != PlayerState.Attack) {
            this.sprit.setState(PlayerState.Attack);
        }

        this.setAnimation(x, y);
        this.handleFlip(x);

        this.move(x, y);
    }

    move(x: number, y: number) {
        if(this.sprit.state === PlayerState.Attack){
            this.sprit.setVelocityX(0);
            this.sprit.setVelocityY(0);
            
            return
        }

        let velocity = this.speed;
        if (x != 0 && y != 0) {
            velocity = Math.sqrt(Math.pow(velocity, 2) / 2);
        }

        this.sprit.setVelocityX(x * velocity);
        this.sprit.setVelocityY(y * velocity);
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
            x = x - 1;
        }
        if (cursors.right.isDown) {
            x = x + 1;
        }

        return x;
    }

    getY(cursors: Types.Input.Keyboard.CursorKeys): number {
        let y = 0;
        if (cursors.up.isDown) {
            y = y - 1;
        }
        if (cursors.down.isDown) {
            y = y + 1;
        }

        return y;
    }

    setAnimation(x: number, y: number) {
        if(this.sprit.state === PlayerState.Attack){
            this.sprit.anims.play('hero_sword_atk', true);
        }else if (x === 0 && y === 0) {
            this.sprit.anims.play('hero_idle', true);
            this.sprit.setState(PlayerState.Idle);
        } else if ((x != 0 || y != 0)) {
            this.sprit.anims.play('hero_run', true);
            this.sprit.setState(PlayerState.Run);
        }
    }
}