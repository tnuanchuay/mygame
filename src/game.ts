import { Types, Game } from 'phaser';
import { BlankScene } from './scenes/BlankScene'

export const config: Types.Core.GameConfig = {
    width: 600,
    height: 500,
    title: 'content',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },
    scene: [new BlankScene()]
};

export class MyGame extends Game {
    constructor() {
        super(config);
    }
}