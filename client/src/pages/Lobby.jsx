import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePlayerStore from "../stores/playerStore.js";
import useLobbyStore from "../stores/lobbyStore.js";
import useRestorePlayer from "../hooks/restorePlayer.js";
import useRestoreLobby from "../hooks/restoreLobby.js";

const Lobby = () => {
  const navigate = useNavigate();
  const { player } = usePlayerStore();
  const { code, players, hostId } = useLobbyStore();
  const [loading, setLoading] = useState(true);

  useRestorePlayer();
  useRestoreLobby();

  console.log(player);
  console.log(code);

  // Watch for when restore finishes and player/lobby are valid
  useEffect(() => {
    if (player && code) {
      setLoading(false);
    }

    if (!player) {
      navigate("/"); // if player somehow doesn't exist, go back
    }
  }, [player, code, navigate]);

  if (loading) return <div className="text-center mt-10">Loading lobby...</div>;

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
    </div>
  );
};

export default Lobby;
