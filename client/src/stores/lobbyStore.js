import { create } from "zustand";

const useLobbyStore = create((set) => ({
  code: null,
  players: [],
  hostId: null,
  playlistIds: [],
  status: "waiting", // matching the enum in MongoDB: "waiting" or "in_progress"

  setLobby: ({ code, players, hostId, playlistIds, status }) =>
    set({
      code,
      players,
      hostId,
      playlistIds: playlistIds ?? [],
      status: status ?? "waiting",
    }),

  addPlayer: (player) =>
    set((state) => ({
      players: [...state.players, player],
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