export interface IPlaylist {
    id: number;
    name: string;
    description: string;
    tracks: ITrack[];
}

export interface ITrack{
    artist: string;
    name: string;
    preview_url: string;
}
class Playlist implements IPlaylist {

    public id: number;
    public name: string;
    public description: string;
    public tracks: ITrack[];

    constructor(playlist:  IPlaylist) {
            this.name = playlist.name;
            this.description = playlist.description;
            this.id = playlist.id;
            this.tracks = playlist.tracks;
    }

}

export default Playlist;
