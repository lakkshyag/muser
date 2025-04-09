import mongoose from "mongoose";

const lobbySchema = new mongoose.Schema({ // use this with the lobby store
  code: { type: String, required: true, unique: true }, // lobby code
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true }, // host player id (reference)  players: { type: [playerSchema], default: [] }, // Embedded array of players
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player", default: [] }], // store player IDs instead of full player objects
  playlistIds: { type: [String], default: [] }, // playlist / album ids both work here
  status: {
    type: String,
    enum: ["waiting", "in_progress"],
    default: "waiting",// might change some stuff here;
  },
  gameSettings: { // use this with the game store
    gameStarted: { type: Boolean, default: false },
    currentRound: { type: Number, default: 0 },
    totalRounds: { type: Number, default: 10 },
    roundTime: { type: Number, default: 30 }, // in seconds
    inputMode: { type: String, enum: ["mcq", "typing"], default: "mcq" },
    gameMode: {
      type: String,
      enum: ["guess-song", "guess-artist", "guess-album"],
      default: "guess-song",
    },
  },
  createdAt: { type: Date, default: Date.now, expires: "10h" }, // need to add custom expire logic which resets the other states as well, this
}); // expire at thing SHOULD be changed soon, because auto expire will leave db in an inconsistent state because of interdepedencies

const Lobby = mongoose.model("Lobby", lobbySchema);
export default Lobby;