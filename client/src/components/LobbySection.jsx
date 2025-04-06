import React from "react";
import { useNavigate } from "react-router-dom";
import server from "../utils/server";
import socket from "../utils/socket";

const LobbySection = () => {
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    const player = JSON.parse(localStorage.getItem("player")); // fetch the current user from browser local storage;

    if (!player) {
      alert("Please join as a player first.");
      return;
    }

    try {
      const res = await server.post("/lobby/create", {
        hostId: player._id,
      });

      const lobby = res.data;

      console.log("Created lobby:", lobby);

      // Save lobby data to localStorage (optional but useful for persistence)
      localStorage.setItem("lobby", JSON.stringify(lobby));

      // Join the room via socket
      socket.emit("join-lobby", {
        lobbyCode: lobby.code,
        player,
      });

      // Navigate to Lobby page
      navigate("/lobby");
    } catch (err) {
      console.error("Error creating lobby:", err);
      alert("Failed to create room.");
    }
  };

  return (
    <div className="text-center">
      <p className="text-lg mb-2">Room Options:</p>
      <div className="flex gap-4 justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          onClick={handleCreateRoom}
        >
          Create Room
        </button>
        <button className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded">
          Join Room
        </button>
      </div>
    </div>
  );
};

export default LobbySection;
