import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import log, {
  callback,
  getPlaylists,
  getOnePlaylist,
} from '../../spotify/login';

import { paramMissingError } from '../../shared/constants';

// Init shared
const router = Router();

/******************************************************************************
 *                      Get All playlists - "GET /api/playlists/all"
 ******************************************************************************/

router.get('/login', async (req: Request, res: Response) => {
  const result = log(req, res);
});

router.get('/callback', async (req: Request, res: Response) => {
  const result = callback(req, res);
});

router.get('/playlists', async (req: Request, res: Response) => {
  const result = getPlaylists(req, res);
});

router.get('/playlist', async (req: Request, res: Response) => {
  const result = getOnePlaylist(req, res);
});

export default router;
