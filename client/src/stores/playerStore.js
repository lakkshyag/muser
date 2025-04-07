import { create } from "zustand";

// this is so the info isnt lost when moving between the pages
// could query info from the db every time but that might take
// its toll if done too many times. this seems better to me 
const usePlayerStore = create((set) => ({ // also the actual structure for this is not final, might get changed
  player: null, // whole player object { _id, name, socketId, score, lobbyCode, etc }

  setPlayer: (player) =>
    set({
      player: {
        _id: player._id ?? null,
        name: player.name ?? "",
        socketId: player.socketId ?? null,
        score: player.score ?? 0,
        lobbyCode: player.lobbyCode ?? null,
        isHost: player.isHost ?? false,
      },
    }),

  updatePlayerField: (field, value) =>
    set((state) => ({
      player: {
        ...state.player,
        [field]: value,
      },
    })),

  resetPlayer: () =>
    set({
      player: null,
    }),
}));

export default usePlayerStore;
