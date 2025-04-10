import express from "express";
import http from "http";
import {Server} from "socket.io";
import setupSocket from "./socket.js";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import spotifyRouter from "./routes/spotify.route.js"; 
import lobbyRouter from "./routes/lobby.route.js";
import playerRouter from "./routes/player.route.js";
import gameRouter from "./routes/game.route.js";

dotenv.config();
// console.log(process.env.SPOTIFY_CLIENT_ID);

const app = express();
const PORT = process.env.PORT || 5000;

// please dont break this time
app.use(cors({
  origin: "http://localhost:3000", // use exact origin instead of "*"
  credentials: true
}));
app.use(express.json());

const mongoURI = process.env.MONGO_URI; // database connectivity
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));


// add main routes here:
app.use("/server/spotify", spotifyRouter);
app.use("/server/lobby", lobbyRouter);
app.use("/server/player", playerRouter);
app.use("/server/game", gameRouter);


const server = http.createServer(app); // giving access to raw http server

const io = new Server(server, { // initialize socket.io with the server;
  cors: {
    origin: "http://localhost:3000", // frontend address;
    // origin: "*", // remove this and set the proper frontend address as origin
    methods: ["GET", "POST"],
    credentials:true
  }
});

setupSocket(io);

// root
app.get("/", (req, res) => {
  res.send("muser server is running");
});

// start
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});