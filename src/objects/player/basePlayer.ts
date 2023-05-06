import {Physics, Scene} from "phaser";

export interface IPlayer {
    GetName: () => string;
    Create: () => void;
    Object: () => Physics.Arcade.Sprite;
    Update: () => void;
    Destroy: () => void;
}

export abstract class BasePlayer implements IPlayer {
    private readonly playerName: string;
    private readonly modeId: string;
    private readonly startX: number;
    private readonly startY: number;
    private readonly scene: Scene;

    private sprite: Physics.Arcade.Sprite;

    constructor(scene: Scene, playerName: string, startX: number, startY: number, modelId: string) {
        this.scene = scene;
        this.playerName = playerName;
        this.startX = startX;
        this.startY = startY;
        this.modeId = modelId;
    }

    abstract Destroy(): void;

    abstract Create(): void;

    abstract Update(): void;

    public GetName = (): string => {
        return this.playerName;
    }

    public Object = (): Phaser.Physics.Arcade.Sprite => {
        return this.sprite;
    }
}