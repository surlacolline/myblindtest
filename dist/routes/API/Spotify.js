"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const login_1 = tslib_1.__importStar(require("../../spotify/login"));
const router = express_1.Router();
router.get("/login", (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const result = login_1.default(req, res);
}));
router.get("/callback", (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const result = login_1.callback(req, res);
}));
router.get("/playlists", (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const result = login_1.getPlaylists(req, res);
}));
router.get("/playlist", (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const result = login_1.getOnePlaylist(req, res);
}));
exports.default = router;
