import { authenticateSpotify, spotifyApi } from "./spotifyAuth.js";
import { cleanSpotifyUrl }  from "./cleanSpotifyUrl.js"; 

export const fetchTracksFromSource = async (url) => { // gets all tracks from the source
  await authenticateSpotify(); // need auth rn;
  const cleanUrl = cleanSpotifyUrl(url);

  const playlistMatch = cleanUrl.match(/playlist\/([a-zA-Z0-9]+)/);
  const albumMatch = cleanUrl.match(/album\/([a-zA-Z0-9]+)/);

  const allTrackIds = []; // store in this;

  try {
    if (playlistMatch) { // if its a playlist;
      const playlistId = playlistMatch[1];
      let offset = 0;
      const limit = 100;

      while (true) {
        const data = await spotifyApi.getPlaylistTracks(playlistId, { limit, offset });
        const items = data.body.items;

        allTrackIds.push(
          ...items
            .map(item => item.track?.id)
            .filter(Boolean)
        );

        if (items.length < limit) break;
        offset += limit;
      }

      return allTrackIds;
    }
    if (albumMatch) { // if its an album;
      const albumId = albumMatch[1];
      let offset = 0;
      const limit = 50;

      while (true) {
        const data = await spotifyApi.getAlbumTracks(albumId, { limit, offset });
        const items = data.body.items;

        allTrackIds.push(
          ...items
            .map(item => item.id)
            .filter(Boolean)
        );

        if (items.length < limit) break;
        offset += limit;
      }

      return allTrackIds;
    }

    throw new Error("Unsupported or invalid Spotify URL");
  } catch (err) {
    console.error("Error fetching tracks:", err);
    return []; // fallback to empty list
  }
};