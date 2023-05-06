import {Physics, Scene} from "phaser";

export interface IPlayer {
    GetName: () => string;
    Create: () => void;
    Object: () => Physics.Arcade.Sprite;
    Destroy: () => void;
}

export abstract class BasePlayer implements IPlayer {
    protected playerName: string;
    protected modelId: string;
    protected startX: number;
    protected startY: number;
    protected scene: Scene;

    sprite: Physics.Arcade.Sprite;

    protected constructor(scene: Scene, playerName: string, startX: number, startY: number, modelId: string) {
        this.scene = scene;
        this.playerName = playerName;
        this.startX = startX;
        this.startY = startY;
        this.modelId = modelId;
    }

    abstract Destroy(): void;

    abstract Create(): void;

    public GetName = (): string => {
        return this.playerName;
    }

    public Object = (): Phaser.Physics.Arcade.Sprite => {
        return this.sprite;
    }
}