import { create } from "zustand";

const useGameStore = create((set) => ({ // dummy, will modify later
  gameStarted: false,
  currentRound: 0,
  totalRounds: 10,
  roundTime: 30, // in seconds
  inputMode: "mcq", // or "typing" 
  gameMode: "guess-song",   // guess-song | guess-artist | guess-album (future)

  setGameStarted: (started) => set({ gameStarted: started }),
  setTotalRounds: (rounds) => set({ totalRounds: rounds }),
  setRoundTime: (time) => set({ roundTime: time }),
  setGameMode: (mode) => set({ gameMode: mode }),
  setInputMode: (mode) => set({ inputMode: mode }),
  setCurrentRound: (round) => set({ currentRound: round }),
}));

export default useGameStore;