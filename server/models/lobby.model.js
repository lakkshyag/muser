import mongoose from "mongoose";

const lobbySchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // Room code
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true }, // Host Player ID (Reference)  players: { type: [playerSchema], default: [] }, // Embedded array of players
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player", default: [] }], // Store player IDs instead of full player objects
  playlistIds: { type: [String], default: [] }, // List of Spotify playlist IDs
  status: {
    type: String,
    enum: ["waiting", "in_progress"],
    default: "waiting",// might change some stuff here;
  },
  createdAt: { type: Date, default: Date.now, expires: "5h" }, // need to add custom expire logic which resets the other states as well, this 
}); // expire at thing SHOULD be changed soon, because auto expire will leave db in an inconsistent state because of interdepedencies

const Lobby = mongoose.model("Lobby", lobbySchema);
export default Lobby;