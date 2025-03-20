// spotify related routes?

import express from "express";
import { fetchPlaylistTracks, fetchAlbumTracks, getPreviewUrlController } from "../controllers/spotify.controller.js";

const router = express.Router();

router.post("/playlist", fetchPlaylistTracks);
router.post("/album", fetchAlbumTracks);
// router.get("/track/:id/preview", getPreviewUrlController);
router.get("/track/:id/preview", getPreviewUrlController); // new preview route


export default router;
