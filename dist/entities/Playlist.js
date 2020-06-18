"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Playlist {
    constructor(playlist) {
        this.tracks = [];
        if (playlist) {
            this.name = playlist.name;
            this.description = playlist.description;
            this.id = playlist.id;
            this.tracks = playlist.tracks;
        }
    }
    ;
}
class Track {
}
exports.Track = Track;
exports.default = Playlist;
