import { Physics, Scene, Types } from "phaser";
import { PlayerState } from "./playerState";

export interface Character {
    Preload: () => void;
    Create: () => void;
    Object: () => Physics.Arcade.Sprite;
    Update: (cursors: Types.Input.Keyboard.CursorKeys) => void;
}

export class Player implements Character {
    private readonly speed: number;

    private scene: Scene;
    private sprite: Physics.Arcade.Sprite;

    constructor(scene: Scene, speed: number) {
        this.scene = scene;
        this.speed = speed;
    }

    Preload = () => {
        this.scene.load.spritesheet('hero_idle', 'assets/hero/player_sword_atk_64x64.png', {
            frameWidth: 38, frameHeight: 64,
        });

        this.scene.load.spritesheet('hero_run', 'assets/hero/player_run48x48.png', {
            frameWidth: 48, frameHeight: 48,
        });

        this.scene.load.spritesheet('hero_sword_atk', 'assets/hero/player_swordatk64x64.png', {
            frameWidth: 64, frameHeight: 64,
        });
    }

    createAnime = () => {
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
    }

    handleOnAnimationComplete = () => {
        this.sprite.on('animationcomplete', () => {
            if (this.sprite.state === PlayerState.Attack) {
                this.sprite.setState(PlayerState.Idle);
            }
        });
    }

    Create = () => {
        const w = this.scene.game.canvas.width;
        const h = this.scene.game.canvas.height;
        this.sprite = this.scene.physics.add.sprite(w / 2, h / 2, 'hero_idle');
        this.sprite.setData("type", "player");

        this.createAnime();

        this.sprite.anims.play('hero_idle');
        this.sprite.setScale(3);
        this.sprite.setOrigin(0.5, 0.5);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setSize(22, 32, true);

        this.handleOnAnimationComplete();
    }

    Object = () => {
        return this.sprite;
    }

    Update = (cursors: Types.Input.Keyboard.CursorKeys) => {
        const x = this.getX(cursors);
        const y = this.getY(cursors);

        this.handleAttack(cursors);

        this.setAnimation(x, y);
        this.handleFlip(x);

        this.move(x, y);
        this.moveCamera();
    }

    handleAttack = (cursors: Types.Input.Keyboard.CursorKeys) => {
        if (cursors.space.isDown && this.sprite.state != PlayerState.Attack) {
            this.sprite.setState(PlayerState.Attack);
        }
    }

    moveCamera = () => {
        const x = this.sprite.x;
        const y = this.sprite.y;
        this.scene.cameras.main.centerOn(x, y);
    }

    move = (x: number, y: number) => {
        if (this.sprite.state === PlayerState.Attack) {
            this.sprite.setVelocityX(0);
            this.sprite.setVelocityY(0);

            return
        }

        let velocity = this.speed;
        if (x != 0 && y != 0) {
            velocity = Math.sqrt(Math.pow(velocity, 2) / 2);
        }

        this.sprite.setVelocityX(x * velocity);
        this.sprite.setVelocityY(y * velocity);
    }

    handleFlip = (x: number) => {
        if (x > 0) {
            this.sprite.flipX = false;
        }
        if (x < 0) {
            this.sprite.flipX = true;
        }
    }

    getX = (cursors: Types.Input.Keyboard.CursorKeys): number => {
        let x = 0;
        if (cursors.left.isDown) {
            x = x - 1;
        }
        if (cursors.right.isDown) {
            x = x + 1;
        }

        return x;
    }

    getY = (cursors: Types.Input.Keyboard.CursorKeys): number => {
        let y = 0;
        if (cursors.up.isDown) {
            y = y - 1;
        }
        if (cursors.down.isDown) {
            y = y + 1;
        }

        return y;
    }

    setAnimation = (x: number, y: number) => {
        if (this.sprite.state === PlayerState.Attack) {
            this.sprite.anims.play('hero_sword_atk', true);
            this.sprite.body.setSize(30, 40, true);

        } else if (x === 0 && y === 0) {
            this.sprite.anims.play('hero_idle', true);
            this.sprite.body.setSize(22, 32, true);
            this.sprite.setState(PlayerState.Idle);
        } else if ((x != 0 || y != 0)) {
            this.sprite.anims.play('hero_run', true);
            this.sprite.body.setSize(22, 32, true);
            this.sprite.setState(PlayerState.Run);
        }
    }
}