// /**
//  * This is an example of a basic node.js script that performs
//  * the Authorization Code oAuth2 flow to authenticate against
//  * the Spotify Accounts.
//  *
//  * For more information, read
//  * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
//  */

import app from '../Server';
import express, { Response, Router } from 'express';
import request from 'es6-request';
import Playlist, { ITrack, Track } from '../entities/Playlist';

import PlaylistDao from '../daos/Playlist/PlaylistDao';

// let cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const playlistDao = new PlaylistDao();

let testToken: any;

// tslint:disable: variable-name
const client_id = 'f6cd9756638b411bb4f994de4e33bd16'; // Your client id
const client_secret = '01ac2e104d5a45dcae46448da7cb2e97'; // Your secret
// const redirect_uri =
//   'https://myblindtest-dev.herokuapp.com/api/spotify/callback'; // Your redirect uri
const redirect_uri = 'http://localhost:3000/api/spotify/callback'; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length: number) => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

export function callback(
  req: any,
  res: { redirect: (arg0: string) => void; clearCookie: (arg0: string) => void }
) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      '/#' +
        querystring.stringify({
          error: 'state_mismatch',
        })
    );
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code,
        redirect_uri,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization:
          'Basic ' +
          new Buffer(client_id + ':' + client_secret).toString('base64'),
      },
      json: true,
    };

    request
      .post('https://accounts.spotify.com/api/token', authOptions)
      .sendForm(authOptions.form)
      .then(([bodyString, response]) => {
        // BodyType, http.IncomingMessageo
        if (response.statusCode === 200) {
          const body = JSON.parse(bodyString as string);
          const access_token = body.access_token;
          const refresh_token = body.refresh_token;
          testToken = access_token;

          const options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { Authorization: 'Bearer ' + access_token },
            json: true,
          };

          // use the access token to access the Spotify Web API
          request
            .get('https://api.spotify.com/v1/me', options)
            .then((body: any) => {
              // tslint:disable-next-line: no-console
              console.log(body);
            });

          // we can also pass the token to the browser to make requests from there
          res.redirect('/playlist');
          //  +
          //     querystring.stringify({
          //       access_token,
          //       refresh_token,
          //     })
          // );
        } else {
          res.redirect(
            '/#' +
              querystring.stringify({
                error: 'invalid_token',
              })
          );
        }
      });
  }
}

export function getPlaylists(req: any, res: any, indexStart: string) {
  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: `https://api.spotify.com/v1/users/11120922355/playlists`,
    headers: { Authorization: 'Bearer ' + testToken },
    json: true,
  };

  request
    .get(
      `https://api.spotify.com/v1/users/11120922355/playlists?offset=${indexStart}`,
      authOptions
    )
    .then((body: any) => {
      const access_token = body.access_token;
      res.send({
        data: JSON.parse(body[0]),
      });
    });
}

export function getCategories(req: any, res: any, indexStart: string) {
  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: `https://api.spotify.com/v1/browse/categories`,
    headers: { Authorization: 'Bearer ' + testToken },
    json: true,
  };

  request
    .get(
      `https://api.spotify.com/v1/browse/categories?offset=${indexStart}`,
      authOptions
    )
    .then((body: any) => {
      const access_token = body.access_token;
      res.send({
        data: JSON.parse(body[0]),
      });
    });
}

export function getOnePlaylist(req: any, res: any) {
  // requesting access token from refresh token
  const idPlaylist = req.query.idPlaylist;
  const authOptions = {
    url: 'https://api.spotify.com/v1/playlists/' + idPlaylist,
    headers: { Authorization: 'Bearer ' + testToken },
    json: true,
  };

  request.get(authOptions.url, authOptions).then((body: any) => {
    let playlist: Playlist = new Playlist();
    playlist = getPlaylist(body[0]);

    if (playlist.tracks.length === 20) {
      playlistDao.add(playlist);
    }

    res.send({
      data: JSON.parse(body[0]),
    });
  });
}

export function getCategoryPlaylists(req: any, res: any) {
  // requesting access token from refresh token
  const idCategory = req.query.idCategory;
  const startIndex = req.query.startIndex;
  const authOptions = {
    url: `https://api.spotify.com/v1/browse/categories/${idCategory}/playlists?offset=${startIndex}`,
    headers: { Authorization: 'Bearer ' + testToken },
    json: true,
  };

  request.get(authOptions.url, authOptions).then((body: any) => {
    const access_token = body.access_token;
    res.send({
      data: JSON.parse(body[0]),
    });
  });
}
function getPlaylist(playlistSpotify: string): Playlist {
  const MyData: any = JSON.parse(playlistSpotify);
  // lire le body et ecrire un nouveau json
  const playlist: Playlist = new Playlist();
  playlist.id = MyData.id;
  playlist.description = MyData.description;
  playlist.name = MyData.name[0].toUpperCase() + MyData.name.slice(1);
  // Boucle pour parcourir les tracks
  // tslint:disable-next-line: forin
  for (const track of MyData.tracks.items) {
    const myTrack: ITrack = new Track();
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
  return playlist;
}

export function getUserPlaylist(req: any, res: any) {
  // requesting access token from refresh token
  const idPlaylist = req.query.idPlaylist;
  const authOptions = {
    url: 'https://api.spotify.com/v1/playlists/' + idPlaylist,
    headers: { Authorization: 'Bearer ' + testToken },
    json: true,
  };

  request.get(authOptions.url, authOptions).then((body: any) => {
    let playlist: Playlist = new Playlist();
    playlist = getPlaylist(body[0]);

    res
      .send({
        data: JSON.stringify(playlist),
      })
      .catch((error: any) => console.log(error));
  });
}

function login(
  req: any,
  res: {
    cookie: (arg0: string, arg1: string) => void;
    redirect: (arg0: string) => void;
  }
) {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);
  // your application requests authorization
  const scope = 'user-read-private user-read-email playlist-read-private';
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id,
        scope,
        redirect_uri,
        state,
      })
  );
}

export default login;
