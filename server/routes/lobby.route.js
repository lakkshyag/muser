import express from "express";
import { createLobby, joinLobby, leaveLobby, getLobbyDetails } from "../controllers/lobby.controller.js";

const router = express.Router();

router.post("/create", createLobby); // creating a lobby
router.post("/join", joinLobby); // joining a lobby
router.post("/leave", leaveLobby); // leaving a lobby
router.get("/:code", getLobbyDetails); // fetching lobby details

export default router;
