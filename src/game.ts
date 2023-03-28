import { Types, Game } from 'phaser';

export const config: Types.Core.GameConfig = {
    width: '100vw',
    height: '100vh',
    title: 'content',
    physics: {
        default: 'arcade',
        arcade: {}
    },
    scene: []
};

export class VampireSurvior extends Game {
    constructor() {
        super(config);
    }
};