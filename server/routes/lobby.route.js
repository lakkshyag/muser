import express from "express";
import { createLobby, joinLobby, leaveLobby, getLobbyDetails, getGameSettings, updateGameSettings, addSourceToLobby, removeSourceFromLobby } from "../controllers/lobby.controller.js";

const router = express.Router();

router.post("/create", createLobby); // creating a lobby
router.post("/join", joinLobby); // joining a lobby
router.post("/leave", leaveLobby); // leaving a lobby
router.get("/:code", getLobbyDetails); // fetching lobby details

router.get("/:code/game-settings", getGameSettings); // get the same settings of a lobby;
router.post("/:code/game-settings", updateGameSettings); // update the game settings of the lobby

router.post("/:code/sources/add", addSourceToLobby); // add a source (plylist / album) to a lobby
router.post("/:code/sources/remove", removeSourceFromLobby); // remove, both ^ and this only host can do

export default router;
