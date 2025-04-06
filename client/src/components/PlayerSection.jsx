import { useEffect, useState } from "react";
import server from "../utils/server";
import socket from "../utils/socket";

const PlayerSection = () => {
  const [name, setName] = useState("");
  const [playerId, setPlayerId] = useState(null);

  // On socket connect or page load
  useEffect(() => {
    socket.on("connect", async () => {
      console.log("Socket connected:", socket.id);

      const storedId = localStorage.getItem("player_id");

      if (storedId) {
        try {
          // Fetch fresh player data
          const res = await server.get(`/player/${storedId}`);
          const player = res.data;

          setPlayerId(player._id);
          setName(player.name);

          // Update socketId if changed
          if (player.socketId !== socket.id) {
            await server.put(`/player/${player._id}`, { socketId: socket.id });
            console.log("Updated socket ID for restored player");
          }

          // Notify backend of reconnection
          socket.emit("guest-connected", {
            _id: player._id,
            name: player.name,
            socketId: socket.id,
          });
        } catch (err) {
          console.warn("Failed to restore player, clearing localStorage");
          localStorage.removeItem("player_id");
          setPlayerId(null);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  const handleGuestJoin = async () => {
    if (!name || !socket.id) {
      return alert("Please enter a name.");
    }

    if (playerId) {
      try {
        await server.delete(`/player/${playerId}`);
        console.log("Old player deleted");
        localStorage.removeItem("player_id");
      } catch (err) {
        console.warn("Failed to delete old player", err);
      }
    }

    try {
      const res = await server.post("/player/guest", {
        name,
        socketId: socket.id,
      });

      const newPlayer = res.data;
      setPlayerId(newPlayer._id);

      // Store only the ID
      localStorage.setItem("player_id", newPlayer._id);

      // Notify backend
      socket.emit("guest-connected", newPlayer);

      console.log("Guest player created:", newPlayer);
      alert(`Welcome, ${newPlayer.name}!`);
    } catch (err) {
      console.error("Failed to create guest player:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="text-center">
      <p className="text-lg mb-2">Join as Guest</p>

      <input
        type="text"
        placeholder="Enter your name"
        className="border px-3 py-2 rounded mb-3 w-60 text-black"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="flex justify-center">
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          onClick={handleGuestJoin}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PlayerSection;
