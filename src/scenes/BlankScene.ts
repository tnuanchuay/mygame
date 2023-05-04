import {Scene, Types} from "phaser";
import {IPlayableCharacter, PlayablePlayer} from "../objects/player/playablePlayer";
import {Mocker, Monster} from "../objects/monsters/mocker";
import P = Phaser.Input.Keyboard.KeyCodes.P;
import {PlayerData} from "../objects/player/type";
import {ICharacter, Player} from "../objects/player/player";
import {LoadPlayerAnimation, LoadPlayerSpriteSheet} from "../objects/player/playerAssetsUtils";

export class BlankScene extends Scene {
    cursors: Types.Input.Keyboard.CursorKeys;
    player: IPlayableCharacter;
    monster: Monster[];
    otherPlayers: ICharacter[];

    playersSocket: WebSocket;

    constructor() {
        super('Scene1');
        this.player = new PlayablePlayer(this, 600);
        this.otherPlayers = [];
    }

    preload = async () => {
        LoadPlayerSpriteSheet(this);
        await this.loadPlayerAsync();
    }

    create = () => {
        LoadPlayerAnimation(this);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.player.Create();
        for (let i = 0; i < this.otherPlayers.length; i++) {
            this.otherPlayers[i].Create();
        }
    }

    loadPlayerAsync() {
        return new Promise<void>((resolve) => {
            this.playersSocket = new WebSocket("ws://localhost:3000/ws/players");
            this.playersSocket.onmessage = (ev) => {
                console.log(ev);
                const playerData = JSON.parse(ev.data) as PlayerData[];
                if (this.otherPlayers.length == 0 && playerData.length != 0) {
                    this.otherPlayers = playerData
                        .filter(i => i.playerName != this.player.GetName())
                        .map(d => new Player(this, d));
                    this.otherPlayers.forEach(i => i.Create());
                }
                resolve();
            }
        })
    }

    update(): void {
        this.player.Update(this.cursors);
        for (let i = 0; i < this.otherPlayers.length; i++
        ) {
            this.otherPlayers[i].Update();
        }
    }
}