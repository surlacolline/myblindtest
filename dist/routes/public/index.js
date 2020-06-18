"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const Playlist_1 = tslib_1.__importDefault(require("./Playlist"));
const path_1 = tslib_1.__importDefault(require("path"));
const router = express_1.Router();
const viewsDir = path_1.default.join(__dirname, "../../views");
router.use("/playlist", Playlist_1.default);
router.get("/playlists", (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    res.sendFile("playlists.html", { root: viewsDir });
}));
exports.default = router;
