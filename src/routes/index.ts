import { Router } from 'express';
import UserRouter from './API/Users';
import PlaylistRouter from './API/Playlists';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
router.use('/playlists', PlaylistRouter);

// Export the base-router
export default router;
