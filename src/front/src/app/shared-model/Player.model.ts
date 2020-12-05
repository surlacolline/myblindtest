export interface IPlayer {
  id: number;
  pseudo: string;
  statut: 'master' | 'guest';
  score: number;
  currentSong: number;
  isConnected: boolean;
}

export interface IPlayerIdentity {
  id: number;
  pseudo: string;
}

class Player implements IPlayer {
  public id!: number;
  public pseudo!: string;
  public statut!: 'master' | 'guest';
  public score!: number;
  public currentSong;
  public isConnected: boolean;

  constructor(joueur?: IPlayer) {
    if (joueur) {
      this.pseudo = joueur.pseudo;
      this.statut = joueur.statut;
      this.id = joueur.id;
      this.score = joueur.score;
      this.currentSong = joueur.currentSong;
      this.isConnected = joueur.isConnected;
    }
  }
}

export default Player;
