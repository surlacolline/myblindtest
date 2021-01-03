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