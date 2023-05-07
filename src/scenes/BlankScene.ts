import {Scene, Types} from "phaser";
import {IPlayableCharacter, PlayablePlayer} from "../objects/player/playablePlayer";
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

    preload = () => {
        LoadPlayerSpriteSheet(this);
        this.loadPlayersAsync();
    }

    create = () => {
        LoadPlayerAnimation(this);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.player.Create();
    }

    loadPlayersAsync = () => {
        this.playersSocket = new WebSocket("ws://localhost:3000/ws/players");

        this.playersSocket.onmessage = (ev) => {
            console.log(ev.data);
            const playerData = JSON.parse(ev.data) as PlayerData[];
            this.syncPlayers(playerData);
        }
    }

    syncPlayers = (playerData: PlayerData[]) => {
        const notSelfPlayerData = playerData.filter(player => player.playerName != this.player.GetName());
        notSelfPlayerData.forEach(player => this.syncPlayer(player));
    }

    syncPlayer = (remotePlayer: PlayerData) => {
        const localPlayers = this.otherPlayers.filter(player => player.GetPlayerData().playerName === remotePlayer.playerName);
        if(localPlayers.length === 0){
            const player = new NonPlayablePlayer(this, remotePlayer);
            console.log(player.GetName());
            player.Create();
            this.otherPlayers.push(player);

        }else if(localPlayers.length > 1){
            localPlayers.forEach(player => player.Destroy());
        }
        else if(this.needToSync(localPlayers[0].GetPlayerData(), remotePlayer)){
            localPlayers[0].Destroy();
        }

        this.otherPlayers = this.otherPlayers.filter(i => !i.IsDestroyed());
    }

    needToSync = (localPlayer: PlayerData, remotePlayer: PlayerData): boolean => {
        if(localPlayer.playerName != remotePlayer.playerName){
            return true
        }

        if(localPlayer.x != remotePlayer.x){
            return true
        }

        if(localPlayer.y != remotePlayer.y){
            return true
        }

        return localPlayer.modelId != remotePlayer.modelId;
    }

    update = () => {
        this.player.Update(this.cursors);
        for (let i = 0; i < this.otherPlayers.length; i++
        ) {
            this.otherPlayers[i].Update();
        }
    }
}