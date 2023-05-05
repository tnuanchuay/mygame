import { Math as PhaserMath} from "phaser";
export const getRandomInt = (max) => {
    return PhaserMath.Between(0, max)
}

export const GetObliqueVelocity = (baseVelocity: number) => {
    return Math.sqrt(Math.pow(baseVelocity, 2) / 2);
}