import { Router } from "express";
import PlaylistRouter from "./Playlist";
import { Request, Response } from "express";
import path from "path";

// Init router and path
const router = Router();
const viewsDir = path.join(__dirname, "../../views");

// Add sub-routes

router.use("/playlist", PlaylistRouter);

router.get("/playlists", async (req: Request, res: Response) => {
  res.sendFile("playlists.html", { root: viewsDir });
});

// Export the base-router
export default router;
