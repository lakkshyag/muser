import { create } from "zustand";

const useGameStore = create((set) => ({ // dummy, will modify later

  gameStarted: false, //these are game settings which were imported from the lobby
  totalRounds: 10,
  roundTime: 30, // in seconds
  inputMode: "mcq", // or "typing" 
  gameMode: "guess-song",   // guess-song | guess-artist | guess-album (future)

  setGameStarted: (started) => set({ gameStarted: started }),
  setTotalRounds: (rounds) => set({ totalRounds: rounds }),
  setRoundTime: (time) => set({ roundTime: time }),
  setGameMode: (mode) => set({ gameMode: mode }),
  setInputMode: (mode) => set({ inputMode: mode }),

  roundNumber: 0, // these are the game states per round
  roundPhase: "waiting", // guessing | reveal | waiting | ended
  options: [], // the 4 MCQ options
  correctAnswer: null,
  playerHasGuessed: false,

  setRoundNumber: (num) => set({ roundNumber: num }),
  setRoundPhase: (phase) => set({ roundPhase: phase }),
  setOptions: (opts) => set({ options: opts }),
  setCorrectAnswer: (ans) => set({ correctAnswer: ans }),
  setPlayerHasGuessed: (val) => set({ playerHasGuessed: val }),
}));

export default useGameStore;