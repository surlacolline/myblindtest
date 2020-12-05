import { IPlayer } from './Player.model';

export interface IGame {
  idGame: string;
  idPlaylist: number;
  playlistName: string;
  players: IPlayer[];
  currentSong: number;
  userPseudo: string;
}

class Game implements IGame {
  public idGame!: string;
  public idPlaylist!: number;
  public playlistName: string;
  public players!: IPlayer[];
  public currentSong;
  public userPseudo!: string;

  constructor(game?: IGame) {
    if (game) {
      this.idGame = game.idGame;
      this.idPlaylist = game.idPlaylist;
      this.playlistName = game.playlistName;
      this.players = game.players;
      this.currentSong = game.currentSong;
      this.userPseudo = game.userPseudo;
    }
  }
}

export default Game;
