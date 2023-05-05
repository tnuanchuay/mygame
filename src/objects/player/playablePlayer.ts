import {Physics, Scene, Types} from "phaser";
import {PlayerState} from "./playerState";
import {LoadPlayerAnimation, LoadPlayerSpriteSheet} from "./playerAssetsUtils";
import {createMovementMessage, createSessionMessage} from "../../net/messages";
import {GetObliqueVelocity} from "../../utils/math";
import {getHeroModelSet} from "../../assets/hero";

export interface IPlayableCharacter {
    GetName: () => string;
    Create: () => void;
    Object: () => Physics.Arcade.Sprite;
    Update: (cursors: Types.Input.Keyboard.CursorKeys) => void;
}

export class PlayablePlayer implements IPlayableCharacter {
    private readonly speed: number;
    private readonly playerName: string;
    private readonly modelId: string;

    private lastX: number;
    private lastY: number;

    private readonly scene: Scene;
    private sprite: Physics.Arcade.Sprite;

    private sessionSocket: WebSocket;
    private movementSocket: WebSocket;

    constructor(scene: Scene, speed: number) {
        this.scene = scene;
        this.speed = speed;
        this.playerName = new URL(document.location.href).searchParams.get("name");
        this.modelId = new URL(document.location.href).searchParams.get("modelId");
    }

    GetName = (): string => {
        return this.playerName;
    }

    private handleOnAnimationComplete = () => {
        this.sprite.on('animationcomplete', () => {
            if (this.sprite.state === PlayerState.Attack) {
                this.sprite.setState(PlayerState.Idle);
            }
        });
    }

    Create = () => {
        const w = this.scene.game.canvas.width;
        const h = this.scene.game.canvas.height;
        this.sprite = this.scene.physics.add.sprite(w / 2, h / 2, getHeroModelSet(this.modelId).StartSprite);
        this.sprite.setData("type", "player");

        LoadPlayerAnimation(this.scene);

        this.sprite.anims.play(getHeroModelSet(this.modelId).Idle);
        this.sprite.setOrigin(0.5, 0.5);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setSize(22, 32, true);

        this.handleOnAnimationComplete();

        this.joinGame();
    }

    private joinGame = () => {
        this.sessionSocket = new WebSocket("ws://localhost:3000/ws/session")
        this.sessionSocket.onopen = () => {
            this.sessionSocket.send(
                createSessionMessage(this.playerName, this.sprite.x, this.sprite.y, this.modelId));
        }

        this.movementSocket = new WebSocket("ws://localhost:3000/ws/move");
    }

    Object = () => {
        return this.sprite;
    }

    Update = (cursors: Types.Input.Keyboard.CursorKeys) => {
        const x = this.getX(cursors);
        const y = this.getY(cursors);

        this.setAnimation(x, y);
        this.handleFlip(x);

        this.move(x, y);
        // this.moveCamera();
        this.updateToServer();
    }

    private updateToServer = () => {
        if (this.movementSocket.readyState != this.movementSocket.OPEN) {
            return
        }

        const x = this.sprite.x;
        const y = this.sprite.y;
        if (this.lastX != x || this.lastY != y) {
            this.movementSocket.send(createMovementMessage(this.playerName, x, y));
            this.lastX = x;
            this.lastY = y;
        }
    }

    private move = (x: number, y: number) => {
        if (this.sprite.state === PlayerState.Attack) {
            this.sprite.setVelocityX(0);
            this.sprite.setVelocityY(0);

            return
        }

        let velocity = this.speed;
        if (x != 0 && y != 0) {
            velocity = GetObliqueVelocity(velocity);
        }

        this.sprite.setVelocityX(x * velocity);
        this.sprite.setVelocityY(y * velocity);
    }

    private handleFlip = (x: number) => {
        if (x > 0) {
            this.sprite.flipX = false;
        }
        if (x < 0) {
            this.sprite.flipX = true;
        }
    }

    private getX = (cursors: Types.Input.Keyboard.CursorKeys): number => {
        let x = 0;
        if (cursors.left.isDown) {
            x = x - 1;
        }
        if (cursors.right.isDown) {
            x = x + 1;
        }

        return x;
    }

    private getY = (cursors: Types.Input.Keyboard.CursorKeys): number => {
        let y = 0;
        if (cursors.up.isDown) {
            y = y - 1;
        }
        if (cursors.down.isDown) {
            y = y + 1;
        }

        return y;
    }

    private setAnimation = (x: number, y: number) => {
        this.sprite.anims.play(getHeroModelSet(this.modelId).Idle, true);
    }
}