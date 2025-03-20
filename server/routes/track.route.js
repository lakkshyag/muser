const express = require("express");
const { fetchTrackPreview } = require("../controllers/track.controller");

const trackRouter = express.Router();

trackRouter.get("/track/:trackId/preview", fetchTrackPreview);

module.exports = trackRouter;
