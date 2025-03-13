import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import SpotifyWebApi from "spotify-web-api-node";
import mongoose from "mongoose";

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

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

app.post("/login", (req, res) => {
  const { code } = req.body;

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.error("Error during authentication:", err);
      res.sendStatus(400);
    });
});

// root
app.get("/", (req, res) => {
  res.send("muser server is running");
});

// start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
