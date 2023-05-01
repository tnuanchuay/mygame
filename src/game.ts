import { Types, Game } from 'phaser';
import { BlankScene } from './scenes/BlankScene'

export const config: Types.Core.GameConfig = {
    width: '100vw',
    height: '100vh',
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

export class VampireSurvior extends Game {
    constructor() {
        super(config);
    }
};