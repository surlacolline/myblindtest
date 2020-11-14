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

// tslint:disable: variable-name
const client_id = 'f6cd9756638b411bb4f994de4e33bd16'; // Your client id
const client_secret = '01ac2e104d5a45dcae46448da7cb2e97'; // Your secret
const stateKey = 'spotify_auth_state';
const stateKeyAPI = 'spotify_auth_state';
let redirect_uri = '';
if (process.env.NODE_ENV === 'development') {
  redirect_uri = 'http://localhost:4200/api/spotify/callback'; // Your redirect uri
} else if (process.env.NODE_ENV === 'production') {
  redirect_uri = 'https://myblindtest-dev.herokuapp.com/api/spotify/callback'; // Your redirect uri
}
const TokenAPI: string = '';
const RefreshTokenAPI: string = '';
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

function login(
  req: any,
  res: Response
  // res: {
  //   cookie: (arg0: string, arg1: string) => void;
  //   redirect: (arg0: string) => void;
  // }
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

export function callback(
  req: any,
  // res2: {
  //   redirect: (arg0: string) => void;
  //   clearCookie: (arg0: string) => void;
  // },
  res: Response
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
      .then(async ([bodyString, response]) => {
        // BodyType, http.IncomingMessageo
        if (response.statusCode === 200) {
          const body = JSON.parse(bodyString as string);
          const access_token = body.access_token;
          const refresh_token = body.refresh_token;
          let id: string;
          let display_name: string;
          const options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { Authorization: 'Bearer ' + access_token },
            json: true,
          };

          // use the access token to access the Spotify Web API

          const bodyUserJson: string[] = (await request.get(
            'https://api.spotify.com/v1/me',
            options
          )) as string[];

          const bodyUser = JSON.parse(bodyUserJson[0]);
          id = bodyUser.id;
          display_name = bodyUser.display_name;
          res.cookie('id', id);
          res.cookie('display_name', display_name, {
            expires: new Date(Date.now() + 900000),
          });

          // response.cookie('token', access_token);
          // we can also pass the token to the browser to make requests from there
          res.cookie('token', access_token);
          res.cookie('RefreshToken', refresh_token);
          res.redirect('/');

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

// function getRefreshToken() {
//   let req: Request;
//   let res: Response;
//   // requesting access token from refresh token
//   // const refresh_token = req.cookies.refresh_token;
//   const authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     headers: {
//       Authorization:
//         'Basic ' +
//         new Buffer(client_id + ':' + client_secret).toString('base64'),
//     },
//     form: {
//       grant_type: 'refresh_token',
//       refresh_token,
//     },
//     json: true,
//   };

//   request
//     .post('https://accounts.spotify.com/api/token', authOptions)
//     .then(([bodyString, response]) => {
//       // BodyType, http.IncomingMessageo
//       if (response.statusCode === 200) {
//         const body = JSON.parse(bodyString as string);
//         const access_token = body.access_token;
//         const refresh_token = body.refresh_token;

//         const options = {
//           url: 'https://api.spotify.com/v1/me',
//           headers: { Authorization: 'Bearer ' + access_token },
//           json: true,
//         };

//         // response.cookie('token', access_token);
//         // we can also pass the token to the browser to make requests from there
//         res.cookie('token', access_token);
//       } else {
//         res.redirect(
//           '/#' +
//             querystring.stringify({
//               error: 'invalid_token',
//             })
//         );
//       }
//     });
// }

export function APILogin(
  req: any,
  // res2: {
  //   redirect: (arg0: string) => void;
  //   clearCookie: (arg0: string) => void;
  // },
  res: Response
) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null;
  const stateAPI = req.query.stateAPI || null;
  const storedStateAPI = req.cookies ? req.cookies[stateKeyAPI] : null;

  res.clearCookie(stateKeyAPI);
  const authOptions = {
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(client_id + ':' + client_secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  request
    .post(
      'https://accounts.spotify.com/api/token?grant_type=client_credentials',
      authOptions
    )
    .then(([bodyString, response]) => {
      // BodyType, http.IncomingMessageo
      if (response.statusCode === 200) {
        const body = JSON.parse(bodyString as string);
        const access_token = body.access_token;
        const refresh_token = body.refresh_token;

        const options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { Authorization: 'Bearer ' + access_token },
          json: true,
        };

        // response.cookie('token', access_token);
        // we can also pass the token to the browser to make requests from there
        res.cookie('tokenAPI', access_token, { maxAge: 3600000 });
        res.redirect('/');
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

export function getPlaylists(req: any, res: any, indexStart: string) {
  // requesting access token from refresh token

  const Token = req.cookies.token;
  const authOptions = {
    url: `https://api.spotify.com/v1/users/${req.cookies.id}/playlists`,
    headers: { Authorization: 'Bearer ' + Token },
    json: true,
  };

  request
    .get(
      `https://api.spotify.com/v1/users/${req.cookies.id}/playlists?limit=50&offset=${indexStart}`,
      authOptions
    )
    .then((body: any) => {
      const access_token = body.access_token;

      res.send({
        data: JSON.parse(body ? body[0] : undefined),
      });
    });
}

export function getCategories(req: any, res: any, indexStart: string) {
  const refresh_token = req.query.refresh_token;
  const Token = req.cookies.tokenAPI;
  const authOptions = {
    url: `https://api.spotify.com/v1/browse/categories`,
    headers: { Authorization: 'Bearer ' + Token },
    json: true,
  };

  request
    .get(
      `https://api.spotify.com/v1/browse/categories?country=FR&limit=50&offset=${indexStart}`,
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
  const idPlaylist = req.query.idPlaylist;
  const Token = req.cookies.token;
  const authOptions = {
    url: 'https://api.spotify.com/v1/playlists/' + idPlaylist,
    headers: { Authorization: 'Bearer ' + Token },
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
  const idCategory = req.query.idCategory;
  let startIndex = req.query.startIndex;
  if (startIndex === undefined) {
    startIndex = 0;
  }
  const Token = req.cookies.tokenAPI;
  const authOptions = {
    url: `https://api.spotify.com/v1/browse/categories/${idCategory}/playlists?country=FR&limit=50&offset=${startIndex}`,
    headers: { Authorization: 'Bearer ' + Token },
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
  if (MyData.error) {
    throw (MyData.error);

  }
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
  const idPlaylist = req.query.idPlaylist;
  const Token = req.cookies.token;
  const authOptions = {
    url: 'https://api.spotify.com/v1/playlists/' + idPlaylist,
    headers: { Authorization: 'Bearer ' + Token },
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

export function getAPIPlaylist(req: any, res: any) {
  const idPlaylist = req.query.idPlaylist;
  const Token = req.cookies.tokenAPI;
  const authOptions = {
    url: 'https://api.spotify.com/v1/playlists/' + idPlaylist,
    headers: { Authorization: 'Bearer ' + Token },
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

export default login;
