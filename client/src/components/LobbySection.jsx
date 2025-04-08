import { useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../utils/server";
import usePlayerStore from "../stores/playerStore.js";
import useLobbyStore from "../stores/lobbyStore";

const LobbySection = () => {
  const navigate = useNavigate();
  const { player, setPlayer } = usePlayerStore(); // use global state
  const [code, setCode] = useState("");
  const { setLobby } = useLobbyStore();

  const handleCodeInput = (e) => { // taking input in the form;
    setCode(e.target.value)
    // console.log(name);
  }
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

  const handleJoinLobby = async () => {
    try {
      // Join the lobby
      const res = await server.post("/lobby/join", {
        playerId: player._id,
        code: code.trim().toUpperCase(),
      });
  
      const { lobby } = res.data;
  
      // Update player Zustand state
      setPlayer({
        ...player,
        lobbyCode: lobby.code,
        isHost: false,
        score: 0,
      });
  
      // Update player in DB
      await server.put(`/player/${player._id}`, {
        lobbyCode: lobby.code,
        isHost: false,
        score: 0,
      });
  
      // Update lobby Zustand state (if you use `setLobby`)
      setLobby(lobby);
  
      // Navigate to the lobby page
      navigate(`/lobby/${lobby.code}`);
    } catch (err) {
      console.error("Failed to join lobby:", err);
      alert("Could not join lobby. Please check the code and try again.");
    }
  };

  return (
    <div className="text-center">
      <p className="text-lg mb-4">Welcome, {player.name}!</p> 
      {/* this welcome can be removed; */}

      <div className="flex justify-center gap-4">
        <div className="create-section">
          <button
            onClick={handleCreateLobby}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Create Lobby
          </button>
        </div>

        <div className="join-section">
          <input
            type="text"
            placeholder="Enter Lobby Code"
            value={code}
            onChange={handleCodeInput}
            className="border p-2 rounded text-black"
          />
          <button
            onClick={handleJoinLobby}
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Join Lobby
          </button>
        </div>
        {/* this button is TODO rn */}
      </div>
    </div>
  );
};

export default LobbySection;
