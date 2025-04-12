// game related routes?
import express from "express";
import { getBalancedTracks, startGame } from "../controllers/game.controller.js";

const router = express.Router();

// router.post("/generate-tracks", getBalancedTracks); // gets the tracks for the game
router.post("/:code/start", startGame);

export default router;