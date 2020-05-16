import { Router } from 'express';
import PlaylistRouter from './Playlist';

// Init router and path
const router = Router();

// Add sub-routes

router.use('/playlist', PlaylistRouter);

// Export the base-router
export default router;
