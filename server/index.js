import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import spotifyRouter from "./routes/spotify.route.js"; 
import lobbyRouter from "./routes/lobby.route.js";
import playerRouter from "./routes/player.route.js";

dotenv.config();
// console.log(process.env.SPOTIFY_CLIENT_ID);

const app = express();
const PORT = process.env.PORT || 5000;

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

// please dont break this time
app.use(cors());
app.use(express.json());

// add main routes here:
app.use("/server/spotify", spotifyRouter);
app.use("/server/lobby", lobbyRouter);
app.use("/server/player", playerRouter);

// root
app.get("/", (req, res) => {
  res.send("muser server is running");
});

// start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
