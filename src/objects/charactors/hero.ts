import { Physics, Scene } from "phaser";

export class Player {
    private image: Physics.Arcade.Image;

    constructor(scene: Scene){
        this.image = scene.physics.add.image(100, 100, 'hero');
        this.image.setCollideWorldBounds(true);
    }

    Object() {
        return this.image;
    }

    setVelocityX(x: number) {
        this.image.setVelocityX(x);
    }

    setVelocityY(y: number) {
        this.image.setVelocityY(y);
    }

    set0Velocity() {
        this.image.setVelocity(0);
    }
}