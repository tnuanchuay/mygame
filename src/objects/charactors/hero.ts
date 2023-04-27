import { Physics, Scene, Types } from "phaser";

export class Player {
    private scene: Scene;
    private image: Physics.Arcade.Image;
    private speed: number;

    constructor(scene: Scene, speed: number){
        const w = scene.game.canvas.width;
        const h = scene.game.canvas.height;

        this.scene = scene;
        this.image = scene.physics.add.image(w/2, h/2, 'hero');
        this.image.setCollideWorldBounds(true);
        this.speed = speed;
    }

    preload(){
        this.scene.load.image('hero', 'assets/hero/char1.png');
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

    walk(cursors: Types.Input.Keyboard.CursorKeys) {
        let x: number = 0;
        let y: number = 0;

        if (cursors.left.isDown) {
            x = x - this.speed;
        }
        if (cursors.right.isDown) {
            x = x + this.speed;
        }
        
        
        if (cursors.up.isDown) {
            y = y - this.speed;
        }
        if (cursors.down.isDown) {
            y = y + this.speed;
        }

        if(x > 0){
            this.image.flipX = true;
        }
        if (x < 0){
            this.image.flipX = false;
        }

        this.setVelocityX(x);
        this.setVelocityY(y);
    }
}