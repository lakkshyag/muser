// preview url copium logic
// to get the preview links for free 
// since they dont work anymore post 27/11/24 (thanks spotify)
// for reference, read: https://github.com/rexdotsh/spotify-preview-url-workaround
// no idea how long this will work but if it stops then this place is where to change

// basically current implementation is as follows:
// get track id (unique from song) from spotify
// forcefully go to the embed url, since that should not
// be removed for the (forseeable) future
// if something breaks, go to the embed page and inspect element again
// and find "audioPreview" or anything with audio in general
// or if that is changed, look for the preview file (in the format):
// "https://p.scdn.co/mp3-preview/"
// if even this is is lost then no idea what to do next

import axios from "axios";
import { load } from "cheerio"; // KATANAGATARI REFERENCE?!?!?! 

export const getSpotifyPreviewUrl = async (trackId) => {
  try {
    const embedUrl = `https://open.spotify.com/embed/track/${trackId}`;
    const response = await axios.get(embedUrl);

    const html = response.data;
    const $ = load(html); // Use load()

    const nextData = $("#__NEXT_DATA__").html();
    const jsonData = JSON.parse(nextData);

    const previewUrl = jsonData?.props?.pageProps?.state?.data?.entity?.audioPreview?.url;

    return previewUrl || null;
  } catch (error) {
    console.error("Error scraping preview URL:", error.message);
    return null;
  }
};
