"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const path_1 = tslib_1.__importDefault(require("path"));
const router = express_1.Router();
const viewsDir = path_1.default.join(__dirname, '../../views');
router.get('', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    res.sendFile('choixPlaylist.html', { root: viewsDir });
}));
router.get('/popup', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    res.sendFile('popup.html', { root: viewsDir });
}));
router.get('/:id', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    res.sendFile('playlist.html', { root: viewsDir });
}));
exports.default = router;
