import { Router } from 'express';
import PlaylistRouter from './playlist';
import { Request, Response } from 'express';
import path from 'path';

// Init router and path
const router = Router();
const viewsDir = path.join(__dirname, '../../views');

// Add sub-routes

router.use('/playlist', PlaylistRouter);

// Export the base-router
export default router;
