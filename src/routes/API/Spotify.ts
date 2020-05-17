import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import log, {callback}  from '../../spotify/login';


import { paramMissingError } from '@shared/constants';

// Init shared
const router = Router();



/******************************************************************************
 *                      Get All playlists - "GET /api/playlists/all"
 ******************************************************************************/

router.get('/login', async (req: Request, res: Response) => {
  const result = log(req,res);
});

router.get('/callback', async (req: Request, res: Response) => {
  let cookie;
  const result = callback(req, res);
});

export default router;