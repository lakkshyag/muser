import { useState } from "react";

import useLobbyStore from "../../stores/lobbyStore.js";
import usePlayerStore from "../../stores/playerStore.js";

import socket from "../../utils/socket.js";
import server from "../../utils/server.js";


const PlaylistManager = () => {
  const [newSource, setNewSource] = useState("");
  const { sources, setSources, lobbyCode, hostId } = useLobbyStore();
  const { playerId } = usePlayerStore();

  const isHost = hostId === playerId;

  const handleAdd = async () => {
    if (!newSource) return;
    try {
      const res = await server.post(`/lobby/${lobbyCode}/sources/add`, {
        playerId,
        sourceUrl: newSource,
      });

      socket.emit("update-sources", {
        lobbyCode,
        sources: res.data.sources,
      });

      setNewSource("");
    } catch (err) {
      console.error("Failed to add source:", err);
    }
  };

  const handleRemove = async (url) => {
    try {
      const res = await server.post(`/lobby/${lobbyCode}/sources/remove`, {
        playerId,
        sourceUrl: url,
      });

      socket.emit("update-sources", {
        lobbyCode,
        sources: res.data.sources,
      });
    } catch (err) {
      console.error("Failed to remove source:", err);
    }
  };

  return (
    <div className="source-manager">
      <h3>Sources</h3>
      {isHost && (
        <div>
          <input
            value={newSource}
            onChange={(e) => setNewSource(e.target.value)}
            placeholder="Paste Spotify URL"
          />
          <button onClick={handleAdd}>Add</button>
        </div>
      )}
      <ul>
        {sources.map((url) => (
          <li key={url}>
            <span>{url}</span>
            {isHost && <button onClick={() => handleRemove(url)}>Remove</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistManager;
