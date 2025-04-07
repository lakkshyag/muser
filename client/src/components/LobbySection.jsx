import { useNavigate } from "react-router-dom";
import server from "../utils/server";
import usePlayerStore from "../stores/playerStore.js";

const LobbySection = () => {
  const navigate = useNavigate();
  const { player, setPlayer } = usePlayerStore(); // use global state

  const handleCreateLobby = async () => {
    try { 
      const res = await server.post("/lobby/create", { // make a lobby with the player id as host;
        hostId: player._id,
      });

      const { lobby } = res.data; // destructure from the response properly

      setPlayer({ // update the zustand state with the lobby code and host;
        ...player,
        lobbyCode: lobby.code,
        isHost: true,
        score: 0,
      });

      await server.put(`/player/${player._id}`, { // need to update current player in the db as well
        lobbyCode: lobby.code,
        isHost: true,
        score: 0,
      });

      navigate(`/lobby/${lobby.code}`); // navigate the current player to the lobby
    } catch (err) {
      console.error("Failed to create lobby:", err);
      alert("Failed to create lobby. Please try again.");
    }
  };

  const handleJoinLobby = () => {
    navigate("/join"); // TODO: but i guess this should be relatively simpler? (famous last words)
  };

  return (
    <div className="text-center">
      <p className="text-lg mb-4">Welcome, {player.name}!</p> 
      {/* this welcome can be removed; */}

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
        {/* this button is TODO rn */}
      </div>
    </div>
  );
};

export default LobbySection;
