import { Router } from 'express';
import UserRouter from './API/Users';
import PlaylistRouter from './API/Playlists';
import SpotifyRouter from './API/Spotify';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
router.use('/playlists', PlaylistRouter);
router.use('/spotify',SpotifyRouter)

// Export the base-router
export default router;
