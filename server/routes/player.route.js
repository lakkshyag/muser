import express from "express";
import { createGuestPlayer, getPlayerById, deletePlayerById, updatePlayer } from "../controllers/player.controller.js";

const router = express.Router();

router.post("/guest", createGuestPlayer);
router.get("/:id", getPlayerById); 
router.delete("/:id", deletePlayerById); 
router.put("/:id", updatePlayer);

export default router;