import express from "express";
import { createGuestPlayer, getPlayerById, deletePlayerById, updatePlayerSocketId } from "../controllers/player.controller.js";

const router = express.Router();

router.post("/guest", createGuestPlayer);
router.get("/:id", getPlayerById); 
router.delete("/:id", deletePlayerById); 
router.put("/:id", updatePlayerSocketId);

export default router;