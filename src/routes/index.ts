import { Router } from "express";
import PlaylistRouter from "./API/Playlists";
import SpotifyRouter from "./API/Spotify";

// Init router and path
const router = Router();

// Add sub-routes
router.use("/playlists", PlaylistRouter);
router.use("/spotify", SpotifyRouter);

// Export the base-router
export default router;
