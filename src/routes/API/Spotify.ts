import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import log, {
  callback,
  getPlaylists,
  getOnePlaylist,
  getUserPlaylist,
  getCategories,
  getCategoryPlaylists,
  APILogin,
  getAPIPlaylist,
} from '../../spotify/login';

import { paramMissingError } from '../../shared/constants';
import path from 'path';

// Init shared
const router = Router();
const viewsDir = path.join(__dirname, '../../views');

/******************************************************************************
 *                      Get All playlists - "GET /api/playlists/all"
 ******************************************************************************/

router.get('/login', async (req: Request, res: Response) => {
  const result = log(req, res);
});

router.get('/callback', async (req: Request, res: Response) => {
  const result = callback(req, res);
});

router.get('/APILogin', async (req: Request, res: Response) => {
  const result = APILogin(req, res);
});

router.get('/playlists', async (req: Request, res: Response) => {
  let { startIndex } = req.query;
  if (startIndex === undefined) {
    startIndex = '0';
  }
  const result = getPlaylists(req, res, startIndex.toString());
});

router.get('/categories', async (req: Request, res: Response) => {
  const { startIndex } = req.query;
  if (startIndex) {
    const result = getCategories(req, res, startIndex.toString());
  } else {
    const result = getCategories(req, res, '0');
  }
});

router.get('/categoryPlaylists', async (req: Request, res: Response) => {
  const result = getCategoryPlaylists(req, res);
});

router.get('/playlist', async (req: Request, res: Response) => {
  const result = getOnePlaylist(req, res);
});

router.get('/playlistAPI', async (req: Request, res: Response) => {
  const result = getAPIPlaylist(req, res);
});

router.get('/user/playlist', async (req: Request, res: Response) => {
  const result = getUserPlaylist(req, res);
});

router.get('/callback', async (req: Request, res: Response) => {
  res.sendFile('choixPlaylist.html', { root: viewsDir });
});

export default router;
