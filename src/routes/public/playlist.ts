import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import path from 'path';
import PlaylistDao from '@daos/playlist/playlistDao.mock';
import { paramMissingError } from '@shared/constants';

// Init shared
const router = Router();
const playlistDao = new PlaylistDao();
const viewsDir = path.join(__dirname, '../../views');


/******************************************************************************
 *                      Get All playlists - "GET /api/playlists/all"
 ******************************************************************************/

router.get('*', async (req: Request, res: Response) => {
   
    res.sendFile('playlist.html', {root: viewsDir});
});


export default router;