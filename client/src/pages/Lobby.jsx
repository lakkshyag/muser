import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePlayerStore from "../stores/playerStore.js";
import useLobbyStore from "../stores/lobbyStore.js";
import useRestorePlayer from "../hooks/restorePlayer.js";
import useRestoreLobby from "../hooks/restoreLobby.js";
import useDetectBackButton from "../hooks/detectBackButton.js";
import server from "../utils/server.js";

const Lobby = () => {
  const navigate = useNavigate();
  const { player } = usePlayerStore();
  const { code, players, hostId, resetLobby } = useLobbyStore();
  
  const playerRestored = useRestorePlayer();   // returns true | false | null
  const lobbyRestored = useRestoreLobby(playerRestored === true); // only try once player is ready
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (playerRestored === null || lobbyRestored === null) return; // react is making me go insane

    if (playerRestored === false || lobbyRestored === false) {
      navigate("/"); // return to home if either lobby or player zustand fail 
      return; 
    }

    if (playerRestored === true && lobbyRestored === true) {
      setLoading(false); // set loading as false if both player and lobby zustand get loaded
    }
  }, [playerRestored, lobbyRestored, navigate]);

  const handleLeaveLobby = async () => {
    try {
      await server.post("/lobby/leave", { playerId: player._id });
      resetLobby(); 
      navigate("/"); 
    } catch (err) {
      console.error("Failed to leave lobby:", err);
      alert("Error leaving lobby. Please try again.");
    }
  };

  useDetectBackButton(handleLeaveLobby);
  if (loading) return <div className="text-center mt-10">Loading lobby...</div>; // maybe make a cute loading animation afterwards?

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold text-center mb-4">Lobby Code: {code}</h2>

      <h3 className="text-xl mb-4 text-center">
        Host:{" "}
        <span className="font-semibold text-indigo-700">
          {players.find((p) => p._id === hostId)?.name || "Unknown"}
        </span>
      </h3>

      <div className="bg-gray-100 rounded p-4 shadow">
        <h4 className="text-lg font-semibold mb-2">Players:</h4>
        <ul className="list-disc pl-5 space-y-1">
          {players.map((p) => (
            <li
              key={p._id}
              className={`${
                p._id === player._id ? "font-bold text-green-700" : ""
              }`}
            >
              {p.name} {p._id === hostId && <span className="text-sm text-gray-600">(Host)</span>}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleLeaveLobby}
        className="mt-6 block mx-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Leave Lobby
      </button>
    </div>
  );
};

export default Lobby;
