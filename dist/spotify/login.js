"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const es6_request_1 = tslib_1.__importDefault(require("es6-request"));
const Playlist_1 = tslib_1.__importStar(require("../entities/Playlist"));
const PlaylistDao_1 = tslib_1.__importDefault(require("../daos/Playlist/PlaylistDao"));
const querystring = require("querystring");
const cookieParser = require("cookie-parser");
const playlistDao = new PlaylistDao_1.default();
let testToken;
const client_id = "f6cd9756638b411bb4f994de4e33bd16";
const client_secret = "01ac2e104d5a45dcae46448da7cb2e97";
const redirect_uri = "http://localhost:3000/api/spotify/callback";
const generateRandomString = (length) => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
const stateKey = "spotify_auth_state";
function callback(req, res) {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;
    if (state === null || state !== storedState) {
        res.redirect("/#" +
            querystring.stringify({
                error: "state_mismatch",
            }));
    }
    else {
        res.clearCookie(stateKey);
        const authOptions = {
            url: "https://accounts.spotify.com/api/token",
            form: {
                code,
                redirect_uri,
                grant_type: "authorization_code",
            },
            headers: {
                Authorization: "Basic " +
                    new Buffer(client_id + ":" + client_secret).toString("base64"),
            },
            json: true,
        };
        es6_request_1.default
            .post("https://accounts.spotify.com/api/token", authOptions)
            .sendForm(authOptions.form)
            .then(([bodyString, response]) => {
            if (response.statusCode === 200) {
                const body = JSON.parse(bodyString);
                const access_token = body.access_token;
                const refresh_token = body.refresh_token;
                testToken = access_token;
                const options = {
                    url: "https://api.spotify.com/v1/me",
                    headers: { Authorization: "Bearer " + access_token },
                    json: true,
                };
                es6_request_1.default
                    .get("https://api.spotify.com/v1/me", options)
                    .then((body) => {
                    console.log(body);
                });
                res.redirect("/#" +
                    querystring.stringify({
                        access_token,
                        refresh_token,
                    }));
            }
            else {
                res.redirect("/#" +
                    querystring.stringify({
                        error: "invalid_token",
                    }));
            }
        });
    }
}
exports.callback = callback;
function getPlaylists(req, res) {
    const refresh_token = req.query.refresh_token;
    const token = "BQDc8bJRpClIRSBkqQ6uWR0XCRT67Usy0bYWhYXAWWMtyiw5bwFomUjZH_Og-0LbITq7_zQJo59nyOvrgrFXBY5w-l0La0ZqCUfbYn7qp6b0yuuO5apT0XMlwzdW83eKaMKB9emRMMyy4iAxQkCi2jQVJW0wOfvMktfWFa70cis-Tg";
    const authOptions = {
        url: "https://api.spotify.com/v1/users/11120922355/playlists",
        headers: { Authorization: "Bearer " + testToken },
        json: true,
    };
    es6_request_1.default
        .get("https://api.spotify.com/v1/users/11120922355/playlists", authOptions)
        .then((body) => {
        const access_token = body.access_token;
        res.send({
            data: JSON.parse(body[0]),
        });
    });
}
exports.getPlaylists = getPlaylists;
function getOnePlaylist(req, res) {
    const idPlaylist = req.query.idPlaylist;
    const authOptions = {
        url: "https://api.spotify.com/v1/playlists/" + idPlaylist,
        headers: { Authorization: "Bearer " + testToken },
        json: true,
    };
    es6_request_1.default.get(authOptions.url, authOptions).then((body) => {
        const MyData = JSON.parse(body[0]);
        const playlist = new Playlist_1.default();
        playlist.id = MyData.id;
        playlist.description = MyData.description;
        playlist.name = MyData.name[0].toUpperCase() + MyData.name.slice(1);
        for (const track of MyData.tracks.items) {
            const myTrack = new Playlist_1.Track();
            myTrack.name = track.track.name;
            myTrack.artist = track.track.artists[0].name;
            myTrack.preview_url = track.track.preview_url;
            if (myTrack.preview_url) {
                playlist.tracks.push(myTrack);
            }
            if (playlist.tracks.length === 20) {
                break;
            }
        }
        if (playlist.tracks.length === 20) {
            playlistDao.add(playlist);
        }
        res.send({
            data: JSON.parse(body[0]),
        });
    });
}
exports.getOnePlaylist = getOnePlaylist;
function login(req, res) {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);
    const scope = "user-read-private user-read-email playlist-read-private";
    res.redirect("https://accounts.spotify.com/authorize?" +
        querystring.stringify({
            response_type: "code",
            client_id,
            scope,
            redirect_uri,
            state,
        }));
}
exports.default = login;
