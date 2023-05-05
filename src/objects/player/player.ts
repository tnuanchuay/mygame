import {Physics, Scene, Types} from "phaser";
import {LoadPlayerAnimation, LoadPlayerSpriteSheet} from "./playerAssetsUtils";
import {PlayerData} from "./type";

export interface ICharacter {
    GetName: () => string;
    Create: () => void;
    Object: () => Physics.Arcade.Sprite;
    Update: () => void;
    SetPosition: (x: number, y: number) => void;
    Destroy: () => void;
}

export class Player implements ICharacter {
    private readonly playerName: string;
    private readonly startX: number;
    private readonly startY: number;
    private nextX: number;
    private nextY: number;

    private scene: Scene;
    private sprite: Physics.Arcade.Sprite;
    private playerSocket: WebSocket;

    constructor(scene: Scene, playerData: PlayerData) {
        this.scene = scene;
        this.playerName = playerData.playerName;
        this.startX = playerData.x;
        this.startY = playerData.y;
        this.nextX = this.startX;
        this.nextY = this.startY;
    }

    public Destroy = () => {
        this.sprite.removeFromDisplayList()
        this.sprite.destroy(true);
    }

    public Create(): void {
        this.sprite = this.scene.physics.add.sprite(this.startX, this.startY, 'hero_idle');
        this.sprite.setData("type", "other_player");

        this.sprite.anims.play('hero_m_idle');
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

    onPlayerUpdate = (playerData: PlayerData) => {
        const x = this.sprite.x;
        const y = this.sprite.y;
        if(playerData.x != x || playerData.y != y){
            this.SetPosition(playerData.x, playerData.y);
        }
    }

    GetName = (): string => {
        return this.playerName;
    }

    public Object(): Phaser.Physics.Arcade.Sprite {
        return this.sprite;
    }

    Update(): void {
        const x = this.sprite.x;
        const y = this.sprite.y;

        if((x == this.nextX) && (y == this.nextY)){
            this.sprite.anims.play('hero_m_idle', true);
            this.sprite.setVelocityX(0);
            this.sprite.setVelocityY(0);
            return
        }

        this.handleFlip(x, this.nextX);
        this.move();
    }

    move = () => {
        this.sprite.anims.play('hero_m_idle', true);

        const x = this.sprite.x;
        const y = this.sprite.y;
        console.log("friend move", this.nextX, this.nextY);
        this.sprite.setVelocityX(this.nextX - x);
        this.sprite.setVelocityY(this.nextY - y);
    }

    handleFlip = (x: number, nextX: number) => {
        if (x > nextX) {
            this.sprite.flipX = true;
        }
        if (x < nextX) {
            this.sprite.flipX = false;
        }
    }

    SetPosition(x: number, y: number) {
        this.nextX = x;
        this.nextY = y;
    }
}