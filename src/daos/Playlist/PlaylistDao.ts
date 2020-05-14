import { IPlaylist } from '@entities/Playlist';


export interface IPlaylistDao {
    getOne: (email: string) => Promise<IPlaylist | null>;
    getAll: () => Promise<IPlaylist[]>;
    add: (Playlist: IPlaylist) => Promise<void>;
    update: (Playlist: IPlaylist) => Promise<void>;
    delete: (id: number) => Promise<void>;
}

class PlaylistDao implements IPlaylistDao {


    /**
     * @param email
     */
    public async getOne(email: string): Promise<IPlaylist | null> {
        // TODO
        return [] as any;
    }


    /**
     *
     */
    public async getAll(): Promise<IPlaylist[]> {
        // TODO
        return [] as any;
    }


    /**
     *
     * @param Playlist
     */
    public async add(Playlist: IPlaylist): Promise<void> {
        // TODO
        return {} as any;
    }


    /**
     *
     * @param Playlist
     */
    public async update(Playlist: IPlaylist): Promise<void> {
        // TODO
        return {} as any;
    }


    /**
     *
     * @param id
     */
    public async delete(id: number): Promise<void> {
        // TODO
        return {} as any;
    }
}

export default PlaylistDao;
