
import { spotifyApi, authenticateSpotify } from "./spotifyAuth.js"; 

export const getSpotifySourceName = async (cleanUrl) => { // basically get the name of either playlist or album;
  await authenticateSpotify(); // 

  const playlistMatch = cleanUrl.match(/playlist\/([a-zA-Z0-9]+)/); // regex
  const albumMatch = cleanUrl.match(/album\/([a-zA-Z0-9]+)/);

  if (playlistMatch) { // if playlist, get the playlist name;
    const data = await spotifyApi.getPlaylist(playlistMatch[1]);
    return data.body.name;
  } else if (albumMatch) { // if album, get the album name
    const data = await spotifyApi.getAlbum(albumMatch[1]);
    return data.body.name;
  }

  throw new Error("Invalid Spotify URL"); // else error
};