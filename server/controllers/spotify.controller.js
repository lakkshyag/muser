// this will contain the majority of the spotify logic
import { authenticateSpotify, spotifyApi } from "../utils/spotifyAuth.js";
import { cleanSpotifyUrl } from "../utils/cleanSpotifyUrl.js";
import { getSpotifyPreviewUrl } from "../utils/getPreviewUrl.js";

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
      id: item.track.id, // only return the ids
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
      id: item.id, // only return the track ids now;
    }));
    res.json({ tracks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch album tracks" });
  }
};

// gets the preivew url using the preview url util function (scraping from embed);
// this function calls help from the ..\utils\getPreviewUrl.js which has the main logic
export const getPreviewUrl = async (req, res) => {
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

// get all details using a track id
export const getTrackDetails = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Track ID is required" });

  try {
    await authenticateSpotify();
    const data = await spotifyApi.getTrack(id);
    const track = data.body;

    const trackDetails = {
      id: track.id,
      name: track.name,
      artists: track.artists.map(artist => artist.name),
      album: {
        name: track.album.name,
        image: track.album.images[0]?.url || null
      },
      duration_ms: track.duration_ms,
      external_url: track.external_urls.spotify,
      popularity: track.popularity
    };

    res.json({ track: trackDetails });
  } catch (error) {
    console.error("Error fetching track details:", error.message);
    res.status(500).json({ error: "Failed to fetch track details" });
  }
};