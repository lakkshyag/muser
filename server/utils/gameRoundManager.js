import GameSession from "../models/gameSession.model.js";
import { io } from "../index.js";

// Temporary in-memory object to hold game state (not saved to DB)
const activeGames = {}; // { [lobbyCode]: { timeoutId, guesses: {} } }


export const startGameRound = async (lobbyCode) => {
    const session = await GameSession.findOne({ code: lobbyCode });
    if (!session) return;
  
    const { currentRound, tracks, settings } = session;
  
    // If we've reached the end, emit game-over
    if (currentRound >= settings.totalRounds) {
      io.to(lobbyCode).emit("game-over");
      return;
    }
  
    const trackId = tracks[currentRound];
    const roundTime = settings.roundTime;
  
    // Save in-memory round state
    activeGames[lobbyCode] = {
      guesses: {}, // to collect guesses
      timeoutId: null,
    };

    console.log(trackId);
  
    // Emit round start to all players in room
    io.to(lobbyCode).emit("round-start", {
      roundNumber: currentRound + 1,
      trackId,
      roundTime,
    });

    console.log("round started");
  
    // Start a timer to auto-end the round after roundTime
    const timeout = setTimeout(() => {
      console.log(`Round ${currentRound + 1} ended for ${lobbyCode}`);
      // We'll add endGameRound() later
    }, roundTime * 1000);
  
    activeGames[lobbyCode].timeoutId = timeout;
};

export const submitGuess = (lobbyCode, playerId, guess) => {
    if (!activeGames[lobbyCode]) return;
    activeGames[lobbyCode].guesses[playerId] = guess; // store/overwrite their guess
};