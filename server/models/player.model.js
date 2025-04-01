import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, default: 0 },
  isHost: { type: Boolean, default: false },
  socketId: { type: String, required: true }, // Needed for WebSockets
  lobbyCode: { type: String, default: null }, // Stores the code of the lobby the player is in
});

const Player = mongoose.model("Player", playerSchema);
export default Player;
export {playerSchema};