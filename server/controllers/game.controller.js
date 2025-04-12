import GameSession from "../models/gameSession.model.js";
import Lobby from "../models/lobby.model.js";
import { getBalancedRandomizedTracks } from "../utils/getBalancedRandomizedTracks.js";
import { fetchTracksFromSource } from "../utils/spotifyTrackFetcher.js";

// export const getBalancedTracks = async (req, res) => { // returns tracks for the game based on playlists and round count
//   const { urls, totalRounds } = req.body;

//   if (!Array.isArray(urls) || urls.length === 0) { // obviously url is required;
//     return res.status(400).json({ error: "At least one Spotify URL is required." });
//   }

//   if (!totalRounds || typeof totalRounds !== "number") { // obviously count is required; 
//     return res.status(400).json({ error: "A valid totalRounds value is required." });
//   }

//   try {
//     const allTrackLists = await Promise.all(
//       urls.map(url => fetchTracksFromSource(url)) // returns array of track ID arrays
//     );

//     const selectedTracks = getBalancedRandomizedTracks(allTrackLists, totalRounds);

//     res.json({ tracks: selectedTracks });
//   } catch (err) {
//     console.error("Error in getBalancedTracksController:", err);
//     res.status(500).json({ error: "Failed to fetch balanced tracks." });
//   }
// }; // <-- comment this out because this was for the route, made a function to use with game start normally


export const getBalancedTracks = async (urls, totalRounds) => { // returns tracks for the game based on playlists and round count
  if (!Array.isArray(urls) || urls.length === 0) { // obviously url is required;
    throw new Error("At least one Spotify URL is required.");
  }

  if (!totalRounds || typeof totalRounds !== "number") { // obviously count is required; 
    throw new Error("A valid totalRounds value is required.");
  }

  const allTrackLists = await Promise.all(
    urls.map((url) => fetchTracksFromSource(url)) // returns array of track ID arrays from playlist / album
  );

  const selectedTracks = getBalancedRandomizedTracks(allTrackLists, totalRounds); // our randomizer + selector
  return selectedTracks; // aaand we return;
};

export const startGame = async (req, res) => {
  const { code } = req.params;
  const { playerId } = req.body;

  try {    
    const lobby = await Lobby.findOne({ code }).populate("players"); // if it even exists;
    if (!lobby) return res.status(404).json({ error: "Lobby not found" });

    if (lobby.hostId.toString() !== playerId) { // only the host can start the game
      return res.status(403).json({ error: "Only the host can start the game" });
    }

    const totalRounds = lobby.gameSettings?.totalRounds || 10; // get the rounds from the lobby game settings
    const urls = lobby.sources?.map(source => source.url) || []; // get ONLY the urls from the lobby sources

    console.log(totalRounds);
    console.log();
    

    const tracks = await getBalancedTracks(urls, totalRounds); // fetch the required tracks using /generate-tracks;


    if (urls.length === 0) { // obviously sources should be there
      return res.status(400).json({ error: "No sources provided" });
    }

    const usableRounds = Math.min(tracks.length, totalRounds); // cannot use more than the fetched amount

    const gameSession = new GameSession({ // create a new game session
      code: lobby.code,
      hostId: lobby.hostId,
      players: lobby.players.map(p => p._id),
      settings: {
        ...lobby.gameSettings,
        totalRounds: usableRounds,
      },
      tracks: tracks,
      currentRound: 0,
    });

    await gameSession.save();

    lobby.status = "in_progress"; // update the lobby status
    await lobby.save();

    return res.status(200).json({
      message: "Game started",
      gameSessionId: gameSession._id,
      totalRounds: usableRounds,
    });
  } catch (err) {
    console.error("Error starting game:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};