import {Scene} from "phaser";
import {PlayerData} from "./type";
import {getHeroModelSet} from "../../assets/hero";
import {Player, IPlayer} from "./player";

export interface INonPlayableCharacter extends IPlayer {
    Update: () => void;
    GetPlayerData: () => PlayerData;
    IsDestroyed: () => boolean;
}

export class NonPlayablePlayer extends Player implements INonPlayableCharacter {
    private nextX: number;
    private nextY: number;
    private isDestroyed: boolean;
    private playerSocket: WebSocket;

    constructor(scene: Scene, playerData: PlayerData) {
        super(scene, playerData.playerName, playerData.x, playerData.y, playerData.modelId);
        this.nextX = playerData.x;
        this.nextY = playerData.y;
        this.isDestroyed = false;
    }

    Destroy = () => {
        this.sprite.removeFromDisplayList();
        this.sprite.destroy(true);
        this.isDestroyed = true;
    }

    Create(): void {
        this.sprite = this.scene.physics.add.sprite(this.startX, this.startY, getHeroModelSet(this.modelId).StartSprite);
        this.sprite.setData("type", "other_player");

        this.sprite.anims.play(getHeroModelSet(this.modelId).Idle, true);
        this.sprite.setOrigin(0.5, 0.5);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setSize(22, 32, true);
        this.playerSocket = new WebSocket(`ws://localhost:3000/ws/player/${this.playerName}`);
        this.playerSocket.onopen = () => {
            this.playerSocket.onmessage = (ev) => {
                const playerData = JSON.parse(ev.data) as PlayerData;
                this.onPlayerUpdate(playerData)
            }
        }
    }

    GetName = (): string => {
        return this.playerName;
    }

    Update = () => {
        const x = this.sprite.x;
        const y = this.sprite.y;

        if ((x == this.nextX) && (y == this.nextY)) {
            this.sprite.anims.play(getHeroModelSet(this.modelId).Idle, true);
            this.sprite.setVelocityX(0);
            this.sprite.setVelocityY(0);
            return
        }
        this.move();
    }

    GetPlayerData = (): PlayerData => {
        return {
            playerName: this.playerName,
            x: this.nextX,
            y: this.nextY,
            modelId: this.modelId,
        }
    }

    IsDestroyed = (): boolean => this.isDestroyed;

    onPlayerUpdate = (playerData: PlayerData) => {
        const x = this.sprite.x;
        const y = this.sprite.y;
        if (playerData.x != x || playerData.y != y) {
            this.setPosition(playerData.x, playerData.y);
        }
    }

    move = () => {
        this.sprite.anims.play(getHeroModelSet(this.modelId).Idle, true);

        const x = this.sprite.x;
        const y = this.sprite.y;

        console.log("friend move", x, y, "to", this.nextX, this.nextY);

        this.handleFlip(x, this.nextX);
        this.sprite.setPosition(this.nextX, this.nextY);
    }

    handleFlip = (x: number, nextX: number) => {
        if (x > nextX) {
            this.sprite.flipX = true;
        }
        if (x < nextX) {
            this.sprite.flipX = false;
        }
    }

    setPosition = (x: number, y: number) => {
        this.nextX = x;
        this.nextY = y;
    }
}