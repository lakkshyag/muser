import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import server from "../utils/server";
import usePlayerStore from "../store/usePlayerStore";

import socket from "../utils/socket";

const LobbySection = () => {
  // const [player, setPlayer] = useState(null);
  const navigate = useNavigate();
  const { player, setPlayer } = usePlayerStore(); // use global state

  useEffect(() => {
    if (!player) {
      navigate("/");
    }
  }, [player, navigate]);

  if (!player) return null; // don't render the rest until navigate happens


  const handleCreateLobby = async () => {
    try {
      const res = await server.post("/lobby/create", {
        hostId: player._id,
      });

      const createdLobby = res.data;
      console.log("Lobby created:", createdLobby);

      // Update in Zustand
      setPlayer({
        ...player,
        lobbyCode: createdLobby.code,
        isHost: true,
        score: 0,
      });

      // Update player in MongoDB
      await server.put(`/player/${player._id}`, {
        lobbyCode: createdLobby.code,
        isHost: true,
        score: 0,
      });

      // Navigate to lobby, Lobby.jsx will fetch lobby info using player ID
      navigate(`/lobby/${createdLobby.code}`);
    } catch (err) {
      console.error("Failed to create lobby:", err);
      alert("Failed to create lobby. Please try again.");
    }
  };

  const handleJoinLobby = () => {
    navigate("/join"); // You can build a join page later if not already made
  };

  return (
    <div className="text-center">
      <p className="text-lg mb-4">Welcome, {player.name}!</p>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleCreateLobby}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Create Lobby
        </button>

        <button
          onClick={handleJoinLobby}
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
        >
          Join Lobby
        </button>
      </div>
    </div>
  );
};

export default LobbySection;
