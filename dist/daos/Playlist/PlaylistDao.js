"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const functions_1 = require("../../shared/functions");
const MockDao_mock_1 = require("../MockDb/MockDao.mock");
class PlaylistDao extends MockDao_mock_1.MockDaoMock {
    getOne(email) {
        const _super = Object.create(null, {
            openDb: { get: () => super.openDb }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield _super.openDb.call(this);
                for (const Playlist of db.playlists) {
                    if (Playlist.email === email) {
                        return Playlist;
                    }
                }
                return null;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getAll() {
        const _super = Object.create(null, {
            openDb: { get: () => super.openDb }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield _super.openDb.call(this);
                return db.playlists;
            }
            catch (err) {
                throw err;
            }
        });
    }
    add(Playlist) {
        const _super = Object.create(null, {
            openDb: { get: () => super.openDb },
            saveDb: { get: () => super.saveDb }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield _super.openDb.call(this);
                Playlist.id = functions_1.getRandomInt();
                db.playlists.push(Playlist);
                yield _super.saveDb.call(this, db);
            }
            catch (err) {
                throw err;
            }
        });
    }
    update(Playlist) {
        const _super = Object.create(null, {
            openDb: { get: () => super.openDb },
            saveDb: { get: () => super.saveDb }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield _super.openDb.call(this);
                for (let i = 0; i < db.playlists.length; i++) {
                    if (db.playlists[i].id === Playlist.id) {
                        db.playlists[i] = Playlist;
                        yield _super.saveDb.call(this, db);
                        return;
                    }
                }
                throw new Error("Playlist not found");
            }
            catch (err) {
                throw err;
            }
        });
    }
    delete(id) {
        const _super = Object.create(null, {
            openDb: { get: () => super.openDb },
            saveDb: { get: () => super.saveDb }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield _super.openDb.call(this);
                for (let i = 0; i < db.playlists.length; i++) {
                    if (db.playlists[i].id === id) {
                        db.playlists.splice(i, 1);
                        yield _super.saveDb.call(this, db);
                        return;
                    }
                }
                throw new Error("Playlist not found");
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = PlaylistDao;
