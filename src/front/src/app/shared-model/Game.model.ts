import { IPlayer } from './Player.model';

export interface IGame {
  idGame: string;
  idPlaylist: number;
  players: IPlayer[];
  currentSong: number;
  pseudo: string;
}

class Game implements IGame {
  public idGame!: string;
  public idPlaylist!: number;
  public players!: IPlayer[];
  public currentSong;
  public pseudo!: string;

  constructor(game?: IGame) {
    if (game) {
      this.idGame = game.idGame;
      this.idPlaylist = game.idPlaylist;
      this.players = game.players;
      this.currentSong = game.currentSong;
      this.pseudo = game.pseudo;
    }
  }
}

export default Game;
