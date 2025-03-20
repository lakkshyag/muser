// preview url copium logic
// to get the preview links for free
// since they dont work anymore post 27/11/24
// for reference, read: https://github.com/rexdotsh/spotify-preview-url-workaround
// no idea how long this will work but if it stops then this place is where to change



import axios from "axios";
import { load } from "cheerio"; 

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
