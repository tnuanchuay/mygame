import { Physics, Scene, Types } from "phaser";
import { PlayerState } from "./playerState";
import {LoadPlayerAnimation, LoadPlayerSpriteSheet} from "./playerAssetsUtils";
import {createMovementMessage, createSessionMessage} from "../../net/messages";

export interface IPlayableCharacter {
    GetName: () => string;
    Preload: () => void;
    Create: () => void;
    Object: () => Physics.Arcade.Sprite;
    Update: (cursors: Types.Input.Keyboard.CursorKeys) => void;
}

export class PlayablePlayer implements IPlayableCharacter{
    private readonly speed: number;
    private readonly playerName: string;
    private lastX: number;
    private lastY: number;

    private scene: Scene;
    private sprite: Physics.Arcade.Sprite;

    private sessionSocket: WebSocket;
    private movementSocket: WebSocket;

    constructor(scene: Scene, speed: number) {
        this.scene = scene;
        this.speed = speed;
        this.playerName = new URL(document.location.href).searchParams.get("name");
    }

    GetName = (): string => {
        return this.playerName;
    }

    Preload = () => {
        LoadPlayerSpriteSheet(this.scene);
    }

    HandleOnAnimationComplete = () => {
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

        LoadPlayerAnimation(this.scene);

        this.sprite.anims.play('hero_idle');
        this.sprite.setScale(3);
        this.sprite.setOrigin(0.5, 0.5);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setSize(22, 32, true);

        this.HandleOnAnimationComplete();

        this.joinGame();
    }

    joinGame = () => {
        this.sessionSocket = new WebSocket("ws://localhost:3000/ws/session")
        this.sessionSocket.onopen = () => {
            this.sessionSocket.send(
                createSessionMessage(this.playerName, this.sprite.x, this.sprite.y));
        }

        this.movementSocket = new WebSocket("ws://localhost:3000/ws/move");
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
        this.updateToServer();
    }

    updateToServer = () => {
        if(this.movementSocket.readyState != this.movementSocket.OPEN){
            return
        }

        const x = this.sprite.x;
        const y = this.sprite.y;
        if(this.lastX != x || this.lastY != y){
            this.movementSocket.send(createMovementMessage(this.playerName, x, y));
            this.lastX = x;
            this.lastY = y;
        }
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