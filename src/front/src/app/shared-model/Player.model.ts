export interface IPlayer {
  id: number;
  pseudo: string;
  statut: 'master' | 'guest';
  score: number;
  currentSong: number;
  isConnected: boolean;
  secretId: string;
}

export interface IPlayerIdentity {
  id: number;
  pseudo: string;
  secretId: string;
}

class Player implements IPlayer {
  public id!: number;
  public pseudo!: string;
  public statut!: 'master' | 'guest';
  public score!: number;
  public currentSong;
  public isConnected: boolean;
  public secretId: string;

  constructor(joueur?: IPlayer) {
    if (joueur) {
      this.pseudo = joueur.pseudo;
      this.statut = joueur.statut;
      this.id = joueur.id;
      this.score = joueur.score;
      this.currentSong = joueur.currentSong;
      this.isConnected = joueur.isConnected;
      this.secretId = joueur.secretId;
    }
  }

}

export default Player;
