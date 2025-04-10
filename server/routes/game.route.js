// game related routes?
import express from "express";
import { getBalancedTracks } from "../controllers/game.controller.js";

const router = express.Router();

router.post("/generate-tracks", getBalancedTracks);


export default router;