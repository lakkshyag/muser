import SpotifyWebApi from "spotify-web-api-node";
import dotenv from "dotenv";
dotenv.config();

export const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});


// Function to authenticate and refresh token only when expired
let tokenExpirationTime = 0;

export const authenticateSpotify = async () => {
    const currentTime = Math.floor(Date.now() / 1000); // in seconds
    if (currentTime < tokenExpirationTime) {
        console.log(`Still valid.`);
        return; // Token still valid, no need to refresh
    }

    try {
        const data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body.access_token);

        // Set token expiration time
        tokenExpirationTime = currentTime + data.body.expires_in - 60; // subtract 60s buffer

        console.log(`Spotify token refreshed. Expires in ${data.body.expires_in} seconds.`);
    } catch (err) {
        console.error("Error authenticating Spotify API:", err);
    }
};
