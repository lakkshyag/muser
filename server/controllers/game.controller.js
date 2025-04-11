import GameSession from "../models/gameSession.model.js";
import Lobby from "../models/lobby.model.js";
import { getBalancedRandomizedTracks } from "../utils/getBalancedRandomizedTracks.js";
import { fetchTracksFromSource } from "../utils/spotifyTrackFetcher.js";

export const startGame = async (req, res) => {
  const { playerId, lobbyCode } = req.body;

  const lobby = await Lobby.findOne({ code: lobbyCode }).populate("players");
  if (!lobby || lobby.hostId.toString() !== playerId) {
    return res.status(403).json({ message: "Only host can start the game." });
  }

  const settings = lobby.gameSettings;

  // TODO
  const tracksPool = await getRandomizedTrackPool(lobby.sources);

  const gameSession = await GameSession.create({
    lobbyCode,
    hostId: lobby.hostId,
    players: lobby.players,
    settings,
    tracksPool,
    currentRound: 1
  });

  res.json(gameSession);
};

export const getBalancedTracks = async (req, res) => { // returns tracks for the game based on playlists and round count
  const { urls, totalRounds } = req.body;

  if (!Array.isArray(urls) || urls.length === 0) { // obviously url is required;
    return res.status(400).json({ error: "At least one Spotify URL is required." });
  }

  if (!totalRounds || typeof totalRounds !== "number") { // obviously count is required; 
    return res.status(400).json({ error: "A valid totalRounds value is required." });
  }

  try {
    const allTrackLists = await Promise.all(
      urls.map(url => fetchTracksFromSource(url)) // returns array of track ID arrays
    );

    const selectedTracks = getBalancedRandomizedTracks(allTrackLists, totalRounds);

    res.json({ tracks: selectedTracks });
  } catch (err) {
    console.error("Error in getBalancedTracksController:", err);
    res.status(500).json({ error: "Failed to fetch balanced tracks." });
  }
};