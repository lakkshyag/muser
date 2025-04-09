import { create } from "zustand";

const useLobbyStore = create((set) => ({ // will most probably be changed
  code: null,
  players: [],
  hostId: null,
  playlistIds: [],
  status: "waiting", 

  setLobby: ({ code, players, hostId, playlistIds, status }) =>
    set({
      code,
      players,
      hostId,
      playlistIds: playlistIds ?? [],
      status: status ?? "waiting",
    }),

  setHostId: (hostId) => set({ hostId }),

  addPlayer: (player) =>
    set((state) => ({
      players: [...state.players, player],
    })),

  setPlayers: (players) =>
    set((state) => ({
      players,
    })),

  removePlayer: (socketId) =>
    set((state) => ({
      players: state.players.filter((p) => p.socketId !== socketId),
    })),

  updateStatus: (newStatus) => set({ status: newStatus }),

  
  resetLobby: () =>
    set({
      code: null,
      players: [],
      hostId: null,
      playlistIds: [],
      status: "waiting",
    }),
}));

export default useLobbyStore;