import {Scene} from "phaser";

export const LoadPlayerSpriteSheet = (scene: Scene) => {
    scene.load.spritesheet('hero_idle', 'assets/hero/player_sword_atk_64x64.png', {
        frameWidth: 38, frameHeight: 64,
    });

    scene.load.spritesheet('hero_run', 'assets/hero/player_run48x48.png', {
        frameWidth: 48, frameHeight: 48,
    });

    scene.load.spritesheet('hero_sword_atk', 'assets/hero/player_swordatk64x64.png', {
        frameWidth: 64, frameHeight: 64,
    });
}

export const LoadPlayerAnimation = (scene: Scene) => {
    scene.anims.create({
        key: 'hero_idle',
        frames: scene.anims.generateFrameNumbers('hero_idle', {
            start: 0,
            end: 9,
        }),
        repeat: -1,
    });

    scene.anims.create({
        key: 'hero_run',
        frames: scene.anims.generateFrameNumbers('hero_run', {
            start: 0,
            end: 7,
        }),
        repeat: -1,
    });

    scene.anims.create({
        key: 'hero_sword_atk',
        frames: scene.anims.generateFrameNames('hero_sword_atk', {
            start: 0,
            end: 5,
        }),
    });
}