// import mongoose from "mongoose";
import Lobby from "../models/lobby.model.js";
import Player from "../models/player.model.js";
import { generateLobbyCode } from "../utils/generateLobbyCode.js"; // join logic, WIP rn;

export const createLobby = async (req, res) => { // create a new lobby
  try { // the host will try to create a lobby;
    const { hostId } = req.body; // will get the mongodb _id from the request body now;
    if (!hostId) return res.status(400).json({ error: "Host ID is required" }); // obviously duh;

    console.log("creating lobby with: ", hostId);

    const hostPlayer = await Player.findById(hostId); // mongodb id search;
    if (!hostPlayer) return res.status(404).json({error: "Host player not found"}); // if we cant find the player in the DB;
    if (hostPlayer.lobbyCode) return res.status(400).json({ error: "Player is already in another lobby" }); // cannot create a room while already in one

    const lobbyCode = generateLobbyCode(); // this is the 6 digit code which users will enter to join;
    console.log("lobby code check: ", lobbyCode);

    const newLobby = new Lobby({
      code: lobbyCode,
      hostId: hostPlayer._id, // the host's mongodb id;
      players: [hostPlayer._id], // host is the first player;
    });

    await newLobby.save(); // save to mongodb

    hostPlayer.lobbyCode = lobbyCode; // assign the lobby code to the host since its their lobby now; 
    hostPlayer.isHost = true; // now that the room is created, host player is actually
    await hostPlayer.save(); // recognized as a host now by the system so it needs to be true;

    res.status(201).json({ message: "Lobby created", lobby: newLobby });
  } catch (err) {
    res.status(500).json({ error: "Failed to create lobby" });
  }
};

export const joinLobby = async (req, res) => { // join using code;
  try { // the room code and the mongo player id; 
    const { code, playerId } = req.body; // and obviously both the room code and player id should be present;
    if (!code || !playerId) return res.status(400).json({ error: "Room code and player ID are required" });

    const lobby = await Lobby.findOne({ code }); // find a lobby with said code
    if (!lobby) return res.status(404).json({ error: "Lobby not found" }); // not found

    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({error: "Player not found"}); // player does not exist in db;
    if (player.lobbyCode) return res.status(400).json({ error: "Player already in lobby" });

    lobby.players.push(player._id); // all checks done i think, push in their id for the lobby to join;
    await lobby.save(); // update

    player.lobbyCode = code; // successfully joined lobby, assign its code;
    await player.save();

    res.status(200).json({ message: "Joined lobby", lobby }); 
  } catch (err) { // success / fail;
    res.status(500).json({ error: "Failed to join lobby" });
  }
};

export const leaveLobby = async (req, res) => { // try to leave a lobby;
  try {
    const { playerId } = req.body; // playerId should be present, its object will contain current room;
    if (!playerId) return res.status(400).json({ error: "Room code and player ID are required" });

    const player = await Player.findById(playerId);
    if (!player || !player.lobbyCode) return res.status(400).json({ error: "Player doesn't exist or is not in a lobby" });

    const lobby = await Lobby.findOne({ code: player.lobbyCode }); // try to find the lobby the player currently is in;
    if (!lobby) return res.status(404).json({ error: "Lobby not found" }); // it needs to exist duh

    lobby.players = lobby.players.filter(id => id.toString() !== playerId); // remove the current player;
    
    player.lobbyCode = null; // not in any room any more
    player.isHost = false; // obviously cannot be a host anymore
    await player.save(); // updating the player details, 
    
    // if the lobby's host was the current player, then need to assign a new host;
    if (lobby.hostId.toString() === playerId && lobby.players.length > 0) {
        lobby.hostId = lobby.players[0]; // make players[0] the new host, guaranteed to exist for > 0 players;
        await Player.findByIdAndUpdate(lobby.hostId, {isHost: true}); // need to set them as host now
    }
    
    await lobby.save(); // update the lobby details in the db

    // but if after leaving there are 0 players remaining so we dissolve the lobby itself;
    if (lobby.players.length === 0) {
        await Lobby.findByIdAndDelete(lobby._id); // delete the lobby itself;
      return res.status(200).json({ message: "Lobby dissolved" });
    }

    res.status(200).json({ message: "Left lobby", lobby });
  } catch (err) {
    res.status(500).json({ error: "Failed to leave lobby" });
  }
};

export const getLobbyDetails = async (req, res) => { // get details using the code;
  try {
    const { code } = req.params; // returns the lobby details + the list of players in the lobby as well;
    const lobby = await Lobby.findOne({ code }).populate("players");

    if (!lobby) return res.status(404).json({ error: "Lobby not found" });

    res.status(200).json({ lobby });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch lobby details" });
  }
};

export const getGameSettings = async (req, res) => { // getting the current game settings
  try { 
    const lobby = await Lobby.findOne({ code: req.params.code }); // if that lobby with this code exists
    if (!lobby) return res.status(404).json({ message: "Lobby not found" });

    res.json(lobby.gameSettings);
  } catch (err) {
    console.error("Error getting game settings:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateGameSettings = async (req, res) => { // updating the game settings
  try {
    const { settings, playerId } = req.body; // please think about the destructures and stuff, player id used to confirm if host;

    const lobby = await Lobby.findOne({ code: req.params.code });
    if (!lobby) return res.status(404).json({ message: "Lobby not found" });

    if (String(lobby.hostId) !== String(playerId)) { // only host of this lobby should be allwoed to change settings
        return res.status(403).json({ message: "Only the host can update game settings." });
    }
    
    lobby.gameSettings = {
      ...lobby.gameSettings,
      ...settings,
    }
    await lobby.save();

    // const lobby = await Lobby.findOneAndUpdate(
    //   { code: req.params.code },
    //   { $set: { gameSettings: settings } },
    //   { new: true }
    // );

    res.json(lobby.gameSettings);
  } catch (err) {
    console.error("Error updating game settings:", err);
    res.status(500).json({ message: "Server error" });
  }
};