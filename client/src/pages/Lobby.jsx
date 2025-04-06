import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket";
import server from "../utils/server";

// CHECK WHAT ALL INFO YOU HAVE FROM THE HOME PAGE IN LOCAL STORAGE THEN PROCEED

const Lobby = () => {
  const [player, setPlayer] = useState(null);
  const [lobby, setLobby] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPlayer = JSON.parse(localStorage.getItem("player"));
    const storedLobby = JSON.parse(localStorage.getItem("lobby"));

    if (!storedPlayer || !storedLobby) {
      alert("Missing player or lobby info. Redirecting to home.");
      navigate("/");
      return;
    }

    setPlayer(storedPlayer);
    setLobby(storedLobby);

    // Rejoin lobby (in case of refresh)
    socket.emit("join-lobby", {
      lobbyCode: storedLobby.code,
      player: storedPlayer,
    });

    // Listen for updates
    socket.on("player-joined", (updatedLobby) => {
      console.log("Updated lobby (player joined):", updatedLobby);
      setLobby(updatedLobby);
    });

    return () => {
      socket.off("player-joined");
    };
  }, [navigate]);

  return (
    <div className="p-6 text-center text-white">
      <h2 className="text-2xl font-bold mb-4">Lobby</h2>

      {lobby ? (
        <>
          <p className="mb-2">
            <strong>Lobby Code:</strong>{" "}
            <span className="text-green-400">{lobby.code}</span>
          </p>
          <p className="mb-4 text-sm text-gray-300">
            Share this code with your friends!
          </p>

          <div className="bg-gray-800 p-4 rounded max-w-md mx-auto mb-6">
            <h3 className="text-lg mb-2 font-semibold">Players:</h3>
            {lobby.players && Array.isArray(lobby.players) ? (
              <ul>
                {lobby.players.map((p) => (
                  <li key={p._id} className="mb-1">
                    {p.name} {p._id === lobby.hostId ? "(Host)" : ""}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">Loading players...</p>
            )}
          </div>

          {player && player._id === lobby.hostId && (
            <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded">
              Start Game
            </button>
          )}
        </>
      ) : (
        <p className="text-gray-400">Loading lobby info...</p>
      )}
    </div>
  );
};

export default Lobby;
