// this will contain the majority of the spotify logic

import SpotifyWebApi from "spotify-web-api-node";
import { cleanSpotifyUrl } from "../utils/cleanSpotifyUrl.js";
import { getSpotifyPreviewUrl } from "../utils/getPreviewUrl.js";
import dotenv from "dotenv";
dotenv.config();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

// Function to get access token using Client Credentials Flow
const authenticateSpotify = async () => {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
  } catch (err) {
    console.error("Error authenticating Spotify API:", err);
  }
};

// Playlist fetch handler
export const fetchPlaylistTracks = async (req, res) => {
  const { playlistUrl } = req.body;
  if (!playlistUrl) return res.status(400).json({ error: "Playlist URL is required" });

  await authenticateSpotify();
  const cleanUrl = cleanSpotifyUrl(playlistUrl);

  // Extract Playlist ID
  const regex = /playlist\/([a-zA-Z0-9]+)/;
  const match = cleanUrl.match(regex);
  if (!match) return res.status(400).json({ error: "Invalid Playlist URL" });

  const playlistId = match[1];

  try {
    const data = await spotifyApi.getPlaylistTracks(playlistId, { limit: 100 });
    const tracks = data.body.items.map(item => ({
      name: item.track.name,
      artist: item.track.artists.map(artist => artist.name).join(", "),
      id: item.track.id, // ADD this!
    }));
    res.json({ tracks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch playlist tracks" });
  }
};

// Album fetch handler
export const fetchAlbumTracks = async (req, res) => {
  const { albumUrl } = req.body;
  if (!albumUrl) return res.status(400).json({ error: "Album URL is required" });

  await authenticateSpotify();
  const cleanUrl = cleanSpotifyUrl(albumUrl);

  // Extract Album ID
  const regex = /album\/([a-zA-Z0-9]+)/;
  const match = cleanUrl.match(regex);
  if (!match) return res.status(400).json({ error: "Invalid Album URL" });

  const albumId = match[1];

  try {
    const data = await spotifyApi.getAlbumTracks(albumId, { limit: 50 });
    const tracks = data.body.items.map(item => ({
      name: item.name,
      artist: item.artists.map(artist => artist.name).join(", "),
      id: item.id, // ADD this!
    }));
    res.json({ tracks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch album tracks" });
  }
};

export const getPreviewUrlController = async (req, res) => {
  try {
    const trackId = req.params.id;
    const previewUrl = await getSpotifyPreviewUrl(trackId);
    if (previewUrl) {
      res.status(200).json({ previewUrl });
    } else {
      res.status(404).json({ message: "Preview URL not found." });
    }
  } catch (error) {
    console.error("Error fetching preview URL:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};