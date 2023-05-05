import {Scene} from "phaser";

export const LoadPlayerSpriteSheet = (scene: Scene) => {
    scene.load.spritesheet('hero_m_idle', 'assets/hero/standing-m-128.png', {
        frameWidth: 128, frameHeight: 128,
    });

    scene.load.spritesheet('hero_fm_idle', 'assets/hero/standing-fm-128.png', {
        frameWidth: 128, frameHeight: 128,
    });
}

export const LoadPlayerAnimation = (scene: Scene) => {
    scene.anims.create({
        key: 'hero_m_idle',
        frames: scene.anims.generateFrameNumbers('hero_m_idle', {
            start: 0,
            end: 10,
        }),
        repeat: -1,
    });

    scene.anims.create({
        key: 'hero_fm_idle',
        frames: scene.anims.generateFrameNumbers('hero_fm_idle', {
            start: 0,
            end: 10,
        }),
        repeat: -1,
    });
}