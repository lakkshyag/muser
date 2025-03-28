import { useState } from "react";
import axios from "axios";

// this file will be THROWN really quick, its just for testing if the previews work or not

export default function PreviewTester() {
  const [trackId, setTrackId] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);

  const fetchPreview = async () => {
    setError(null);
    setPreviewUrl(null);
    try {
      const response = await axios.get(
        `http://localhost:5000/server/spotify/track/${trackId}/preview`
      );
      if (response.data.previewUrl) {
        setPreviewUrl(response.data.previewUrl);
      } else {
        setError("No preview available for this track.");
      }
    } catch (err) {
      setError("Failed to fetch preview.");
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-4">Spotify Preview Tester</h1>
      <input
        type="text"
        className="p-2 text-black rounded"
        placeholder="Enter Track ID"
        value={trackId}
        onChange={(e) => setTrackId(e.target.value)}
      />
      <button
        onClick={fetchPreview}
        className="mt-2 bg-green-500 px-4 py-2 rounded"
      >
        Fetch Preview
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {previewUrl && (
        <audio controls className="mt-4">
          <source src={previewUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}
