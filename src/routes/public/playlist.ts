import { Request, Response, Router } from 'express';
import path from 'path';



// Init shared
const router = Router();

const viewsDir = path.join(__dirname, '../../views');


/******************************************************************************
 *                      Get All playlists - "GET /api/playlists/all"
 ******************************************************************************/

router.get('*', async (req: Request, res: Response) => {
   
    res.sendFile('playlist.html', {root: viewsDir});
});


export default router;