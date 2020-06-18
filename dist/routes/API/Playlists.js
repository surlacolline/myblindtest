"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const PlaylistDao_1 = tslib_1.__importDefault(require("../../daos/Playlist/PlaylistDao"));
const constants_1 = require("../../shared/constants");
const router = express_1.Router();
const playlistDao = new PlaylistDao_1.default();
router.get("/all", (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const playlists = yield playlistDao.getAll();
    return res.status(http_status_codes_1.OK).json({ playlists });
}));
router.post("/add", (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { playlist } = req.body;
    if (!playlist) {
        return res.status(http_status_codes_1.BAD_REQUEST).json({
            error: constants_1.paramMissingError,
        });
    }
    yield playlistDao.add(playlist);
    return res.status(http_status_codes_1.CREATED).end();
}));
router.put("/update", (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { playlist } = req.body;
    if (!playlist) {
        return res.status(http_status_codes_1.BAD_REQUEST).json({
            error: constants_1.paramMissingError,
        });
    }
    playlist.id = Number(playlist.id);
    yield playlistDao.update(playlist);
    return res.status(http_status_codes_1.OK).end();
}));
router.delete("/delete/:id", (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield playlistDao.delete(Number(id));
    return res.status(http_status_codes_1.OK).end();
}));
exports.default = router;
