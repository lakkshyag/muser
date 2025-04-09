import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePlayerStore from "../../stores/playerStore.js";
import useLobbyStore from "../../stores/lobbyStore.js";
import useDetectBackButton from "../../hooks/detectBackButton.js";
import server from "../../utils/server.js";
import socket from "../../utils/socket.js";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { player } = usePlayerStore();
  const { code, players, hostId, resetLobby, setPlayers, setHostId } = useLobbyStore();

  useEffect(() => { // this is for actually emmitting the event after joining the lobby;
    if (player && code) { // if player exists with a id and code as well;
      console.log("emitting join lobby 1");
      socket.emit("join-lobby", {
        playerId: player._id,
        lobbyCode: code,
      });
    }
  }, [player, code]);

  useEffect(() => { // this one is for dynamic player joins;
    if (!player || !code) return; // should not ideally hppen;
  
    const handlePlayerJoined = ({players, hostId}) => { // get the updated player list;
      console.log("socket up after joining:", {players, hostId});
      setPlayers(players);
      setHostId(hostId);
    };
  
    socket.on("player-joined", handlePlayerJoined);
  
    return () => {
      socket.off("player-joined", handlePlayerJoined);
    };
  }, [player, code, setPlayers, hostId, setHostId]);

  useEffect(() => {
    const handlePlayerLeft = ({players, hostId}) => {
      console.log("socket up after leaving:", {players, hostId});
      setPlayers(players);
      setHostId(hostId);
    };
  
    socket.on("player-left", handlePlayerLeft);
  
    return () => {
      socket.off("player-left", handlePlayerLeft);
    };
  }, [setPlayers, hostId, setHostId]);
  
  const handleLeaveLobby = async () => {
    try {
      await server.post("/lobby/leave", { playerId: player._id });
      console.log("emitting leave lobby 1");

      socket.emit("leave-lobby", {
        playerId: player._id,
        lobbyCode: code, // pulled from Zustand before it's cleared
      });

      resetLobby(); 
      navigate("/"); 
    } catch (err) {
      console.error("Failed to leave lobby:", err);
      alert("Error leaving lobby. Please try again.");
    }
  };

  useDetectBackButton(handleLeaveLobby);

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

export default LeftSidebar;
