import { IPlaylist } from '@entities/Playlist';
import { getRandomInt } from '@shared/functions';
import { MockDaoMock } from '../MockDb/MockDao.mock';
import { IPlaylistDao } from './PlaylistDao';


class PlaylistDao extends MockDaoMock implements IPlaylistDao {


    public async getOne(email: string): Promise<IPlaylist | null> {
        try {
            const db = await super.openDb();
            for (const Playlist of db.playlists) {
                if (Playlist.email === email) {
                    return Playlist;
                }
            }
            return null;
        } catch (err) {
            throw err;
        }
    }


    public async getAll(): Promise<any[]> {
        try {
            const db = await super.openDb();
            return db.playlists;
        } catch (err) {
            throw err;
        }
    }


    public async add(Playlist: IPlaylist): Promise<void> {
        try {
            const db = await super.openDb();
            Playlist.id = getRandomInt();
            db.playlists.push(Playlist);
            await super.saveDb(db);
        } catch (err) {
            throw err;
        }
    }


    public async update(Playlist: IPlaylist): Promise<void> {
        try {
            const db = await super.openDb();
            for (let i = 0; i < db.playlists.length; i++) {
                if (db.playlists[i].id === Playlist.id) {
                    db.playlists[i] = Playlist;
                    await super.saveDb(db);
                    return;
                }
            }
            throw new Error('Playlist not found');
        } catch (err) {
            throw err;
        }
    }


    public async delete(id: number): Promise<void> {
        try {
            const db = await super.openDb();
            for (let i = 0; i < db.playlists.length; i++) {
                if (db.playlists[i].id === id) {
                    db.playlists.splice(i, 1);
                    await super.saveDb(db);
                    return;
                }
            }
            throw new Error('Playlist not found');
        } catch (err) {
            throw err;
        }
    }
}

export default PlaylistDao;
