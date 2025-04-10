// spotify related routes?

import express from "express";
import { fetchPlaylistTracks, fetchAlbumTracks, getPreviewUrl, getTrackDetails } from "../controllers/spotify.controller.js";

const router = express.Router();

router.post("/playlist", fetchPlaylistTracks); // get all tracks in playlist (<= 50 rn)
router.post("/album", fetchAlbumTracks); // get all songs in an album
router.get("/track/:id/preview", getPreviewUrl); // get the actual mp3 preview
router.get("/track/:id/details", getTrackDetails); // get all details for a single tracj

export default router;