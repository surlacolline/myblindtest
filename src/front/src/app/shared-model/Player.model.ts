export interface IPlayer {
  id: number;
  name: string;
  statut: string;
  score: number;
  currentSong: number;
}

class Player implements IPlayer {
  public id!: number;
  public name!: string;
  public statut!: string;
  public score!: number;
  public currentSong;
  number;

  constructor(joueur?: IPlayer) {
    if (joueur) {
      this.name = joueur.name;
      this.statut = joueur.statut;
      this.id = joueur.id;
      this.score = joueur.score;
      this.currentSong = joueur.currentSong;
    }
  }
}

export default Player;
