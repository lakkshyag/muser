import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, default: 0 },
  isHost: { type: Boolean, default: false },
  socketId: { type: String, required: true }, // needed for WebSockets
  lobbyCode: { type: String, default: null }, // ntores the code of the lobby the player is in
  createdAt: { type: Date, default: Date.now, expires: "7d"} // automatically deletes after 7 days
});

const Player = mongoose.model("Player", playerSchema);
export default Player;
export {playerSchema};