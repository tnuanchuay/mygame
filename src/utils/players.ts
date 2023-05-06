import {INonPlayableCharacter} from "../objects/player/nonPlayablePlayer";
import {PlayerData} from "../objects/player/type";

export const playerExists = (otherPlayers: INonPlayableCharacter[], playerData: PlayerData) => {
    for (let i = 0; i < otherPlayers.length; i++) {
        if (otherPlayers[i].GetName() === playerData.playerName) {
            return true
        }
    }

    return false;
}