import { Types, Game } from 'phaser';
import { InlaidLibraryBattleScene } from './scenes/InlaidLibrary'

export const config: Types.Core.GameConfig = {
    width: '100vw',
    height: '100vh',
    title: 'content',
    physics: {
        default: 'arcade',
        arcade: {}
    },
    scene: [new InlaidLibraryBattleScene()]
};

export class VampireSurvior extends Game {
    constructor() {
        super(config);
    }
};