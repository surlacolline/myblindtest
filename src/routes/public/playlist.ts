import { Request, Response, Router } from 'express';
import path from 'path';
import { ParamsDictionary } from 'express-serve-static-core';

// Init shared
const router = Router();

const viewsDir = path.join(__dirname, '../../views');

/******************************************************************************
 *                      Get choix playlists html - "GET /playlists"
 ******************************************************************************/

router.get('', async (req: Request, res: Response) => {
  res.sendFile('choixPlaylist.html', { root: viewsDir });
});

/******************************************************************************
 *                      Get popup html - "GET /playlists"
 ******************************************************************************/
router.get('/popup', async (req: Request, res: Response) => {
  res.sendFile('popup.html', { root: viewsDir });
});

/******************************************************************************
 *                      Get choix playlists html - "GET /playlists"
 ******************************************************************************/
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params as ParamsDictionary;
  res.sendFile('playlist.html', { root: viewsDir });
});

export default router;
