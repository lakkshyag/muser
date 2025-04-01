import express from "express";
import { createGuestPlayer } from "../controllers/player.controller.js";

const router = express.Router();

router.post("/guest", createGuestPlayer);

export default router;