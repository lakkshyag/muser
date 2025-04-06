import express from "express";
import { createGuestPlayer, getPlayerById, deletePlayerById } from "../controllers/player.controller.js";

const router = express.Router();

router.post("/guest", createGuestPlayer);
router.get("/:id", getPlayerById); // ← New route
router.delete("/:id", deletePlayerById); // (Optional for cleanup)

export default router;