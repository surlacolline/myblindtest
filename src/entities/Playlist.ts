export interface IPlaylist {
    id: number;
    name: string;
    email: string;
}

class Playlist implements IPlaylist {

    public id: number;
    public name: string;
    public email: string;

    constructor(nameOrPlaylist: string | IPlaylist, email?: string, id?: number) {
        if (typeof nameOrPlaylist === 'string') {
            this.name = nameOrPlaylist;
            this.email = email || '';
            this.id = id || -1;
        } else {
            this.name = nameOrPlaylist.name;
            this.email = nameOrPlaylist.email;
            this.id = nameOrPlaylist.id;
        }
    }
}

export default Playlist;
