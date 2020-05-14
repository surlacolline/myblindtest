import { Router } from 'express';
import UserRouter from './Users';
import PlaylistRouter from './Playlists';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
router.use('/playlists', PlaylistRouter);

// Export the base-router
export default router;
