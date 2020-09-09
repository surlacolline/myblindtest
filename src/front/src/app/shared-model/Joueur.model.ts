export interface IJoueur {
  id: number;
  name: string;
  statut: string;
  score: number;
}

class Joueur implements IJoueur {
  public id!: number;
  public name!: string;
  public statut!: string;
  public score!: number;

  constructor(joueur?: IJoueur) {
    if (joueur) {
      this.name = joueur.name;
      this.statut = joueur.statut;
      this.id = joueur.id;
      this.score = joueur.score;
    }
  }
}

export default Joueur;
