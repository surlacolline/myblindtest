import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

import PlaylistDao from '../../daos/Playlist/PlaylistDao';
import { paramMissingError } from '../../shared/constants';

// Init shared
const router = Router();
const playlistDao = new PlaylistDao();

/******************************************************************************
 *                      Get All playlists - "GET /api/playlists/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
  const playlists = await playlistDao.getAll();
  return res.status(OK).json({ playlists });
});

/******************************************************************************
 *                       Add One - "POST /api/playlists/add"
 ******************************************************************************/

router.post('/add', async (req: Request, res: Response) => {
  const { playlist } = req.body;
  if (!playlist) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  await playlistDao.add(playlist);
  return res.status(CREATED).end();
});

/******************************************************************************
 *                       Update - "PUT /api/playlists/update"
 ******************************************************************************/

router.put('/update', async (req: Request, res: Response) => {
  const { playlist } = req.body;
  if (!playlist) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  playlist.id = Number(playlist.id);
  await playlistDao.update(playlist);
  return res.status(OK).end();
});

/******************************************************************************
 *                    Delete - "DELETE /api/playlists/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
  const { id } = req.params as ParamsDictionary;
  await playlistDao.delete(Number(id));
  return res.status(OK).end();
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
