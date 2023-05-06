import {Scene, Types} from "phaser";
import {IPlayableCharacter, PlayablePlayer} from "../objects/player/playablePlayer";
import {Mocker, Monster} from "../objects/monsters/mocker";
import {PlayerData} from "../objects/player/type";
import {INonPlayableCharacter, NonPlayablePlayer} from "../objects/player/nonPlayablePlayer";
import {LoadPlayerAnimation, LoadPlayerSpriteSheet} from "../objects/player/playerAssetsUtils";
import {playerExists} from "../utils/players";

export class BlankScene extends Scene {
    cursors: Types.Input.Keyboard.CursorKeys;
    player: IPlayableCharacter;
    otherPlayers: INonPlayableCharacter[];

    playersSocket: WebSocket;

    constructor() {
        super('BlankScene');
        this.player = new PlayablePlayer(this, 600);
        this.otherPlayers = [];
    }

    preload = async () => {
        LoadPlayerSpriteSheet(this);
        await this.loadPlayersAsync();
    }

    create = () => {
        LoadPlayerAnimation(this);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.player.Create();
        for (let i = 0; i < this.otherPlayers.length; i++) {
            this.otherPlayers[i].Create();
        }
    }

    loadPlayersAsync() {
        return new Promise<void>((resolve) => {
            this.playersSocket = new WebSocket("ws://localhost:3000/ws/players");
            this.playersSocket.onmessage = (ev) => {
                const playerData = JSON.parse(ev.data) as PlayerData[];
                this.addNewOtherPlayers(playerData);
                this.removeDisconnectedPlayer(playerData);
                resolve();
            }
        })
    }

    addNewOtherPlayers = (playersData: PlayerData[]) => {
        for (let i = 0; i < playersData.length; i++) {
            if (playersData[i].playerName === this.player.GetName()) {
                continue
            }

            if (!playerExists(this.otherPlayers, playersData[i])) {
                const player = new NonPlayablePlayer(this, playersData[i]);
                player.Create();
                this.otherPlayers.push(player);
            }
        }
    }

    removeDisconnectedPlayer = (playerData: PlayerData[]) => {
        const nameList = playerData.map(i => i.playerName);
        const removeList = this.otherPlayers.filter(i => nameList.indexOf(i.GetName()) < 0);
        this.otherPlayers = this.otherPlayers.filter(i => nameList.indexOf(i.GetName()) >= 0);
        removeList.forEach(i => {
            i.Destroy();
        });
    }

    update(): void {
        this.player.Update(this.cursors);
        for (let i = 0; i < this.otherPlayers.length; i++
        ) {
            this.otherPlayers[i].Update();
        }
    }
}