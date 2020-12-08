import { IPlayer } from './Player';

export interface IGame {
    idGame: string;
    idPlaylist: number;
    playlistName: string;
    players: IPlayer[];
    currentSong: number;
    userPseudo: string;
}