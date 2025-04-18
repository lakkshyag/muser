import mongoose from "mongoose";

const gameSessionSchema = new mongoose.Schema({
  code: { type: String, required: true }, // to link it back to the lobby
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player", default: [] }],
  settings: {
    totalRounds: Number,
    roundTime: Number,
    inputMode: String,
    gameMode: String,
  },

  tracks: [String], // could be track IDs
  currentRound: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now, expires: 60 * 60 } // auto-delete after 1 hour
});

export default mongoose.model("GameSession", gameSessionSchema);