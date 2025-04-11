import { create } from "zustand";

const useLobbyStore = create((set) => ({ // will most probably be changed
  code: null,
  players: [],
  hostId: null,
  sources: [], // playlist but we can also add albums here so why not
  status: "waiting", 

  setLobby: ({ code, players, hostId, sources, status }) =>
    set({
      code,
      players,
      hostId,
      sources: sources ?? [],
      status: status ?? "waiting",
    }),

  setHostId: (hostId) => set({ hostId }),

  setSources: (newSources) => set({ sources: newSources }),

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
      sources: [],
      status: "waiting",
    }),
}));

export default useLobbyStore;