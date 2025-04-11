import { useState, useEffect } from "react";

import useLobbyStore from "../../stores/lobbyStore.js";
import usePlayerStore from "../../stores/playerStore.js";

import socket from "../../utils/socket.js";
import server from "../../utils/server.js";


const SourceManager = () => {
  const [newSource, setNewSource] = useState("");
  const { sources, setSources, addSource, removeSource, code } = useLobbyStore();
  const { player } = usePlayerStore(); // the player store has an object, different from lobby and game

  const handleAddSource = async (newUrl) => { // add a new source; 
    try {  // first db
      const res = await server.post(`/lobby/${code}/sources/add`, {
        playerId: player._id, 
        sourceUrl: newUrl,
      });
  
      const updatedSources = res.data.sources;
      setSources(updatedSources); // then the zustand update
  
      socket.emit("update-sources", { // and at the end socket updates
        code,
        sources: updatedSources,
      });
  
      return { success: true };
    } catch (err) {
      console.error("Error adding source:", err.response?.data || err.message);
      return { success: false, error: err };
    }
  };

  const handleRemoveSource = async (sourceUrl) => { // remove an existing source  
    try { // first the db
      const res = await server.post(`/lobby/${code}/sources/remove`, {
        playerId: player._id,
        sourceUrl,
      });
  
      const updatedSources = res.data.sources;
      setSources(updatedSources); // then the store;
  
      socket.emit("update-sources", { // and finally the socket 
        code,
        sources: updatedSources,
      });
  
      return { success: true };
    } catch (err) {
      console.error("Error removing source:", err.response?.data || err.message);
      return { success: false, error: err };
    }
  };

  useEffect(() => {
    const handleUpdateSources = ({ sources }) => { // listen for updates;
      setSources(sources); // if yes, change according to new sources
    };
  
    socket.on("update-sources", handleUpdateSources);
  
    return () => {
      socket.off("update-sources", handleUpdateSources);
    };
  }, []);

  return (
    <div className="source-manager w-full">
      <h3>Sources</h3>
      {player.isHost && (
        <div>
          <input
            value={newSource}
            onChange={(e) => setNewSource(e.target.value)}
            placeholder="Paste Spotify URL"
          />
          <button onClick={() => handleAddSource(newSource)}>Add</button>
        </div>
      )}
      <ul>
        {sources.map(({ url, name }) => (
          <li key={url}>
            <span>{name}</span>
            {player.isHost && <button onClick={() => handleRemoveSource(url)}>Remove</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SourceManager;
