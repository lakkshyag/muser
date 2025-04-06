import { useEffect, useState } from "react";
import server from "../utils/server";
import socket from "../utils/socket";
import usePlayerStore from "../store/usePlayerStore";

const PlayerSection = () => {
  const { player, setPlayer, resetPlayer } = usePlayerStore();
  const [name, setName] = useState(player?.name || "");
  // const [playerId, setPlayerId] = useState(null); // rip local state management, you wont be missed;

  // On socket connect or page load
  useEffect(() => {
    if (player?.name && name !== player.name) {
      setName(player.name);
    }
  }, [player?.name]);

  useEffect(() => {
    socket.on("connect", async () => {
      console.log("Socket connected:", socket.id);
      const storedId = localStorage.getItem("player_id");

      if (storedId) {
        try {
          // Fetch fresh player data
          const res = await server.get(`/player/${storedId}`);
          const fetchedPlayer = res.data;

          console.log(fetchedPlayer);

          setPlayer(fetchedPlayer);
          setName(fetchedPlayer.name);

          // console.log("pre socket upd");

          // Update socketId if changed
          if (fetchedPlayer.socketId !== socket.id) {
            await server.put(`/player/${fetchedPlayer._id}`, { socketId: socket.id });
            console.log("Updated socket ID for restored player");
          }

          // console.log("post socket upd");


          // Notify backend of reconnection
          socket.emit("guest-connected", {
            ...fetchedPlayer,
            socketId: socket.id,
          });

        } catch (err) {
          console.warn("Failed to restore player, clearing localStorage");
          localStorage.removeItem("player_id");
          resetPlayer();
          alert("Your session expired. Please rejoin.");
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

    if (player) {
      try {
        await server.delete(`/player/${player._id}`);
        console.log("Old player deleted");
        localStorage.removeItem("player_id");
      } catch (err) {
        console.warn("Failed to delete old player", err);
      }
    }

    try {
      const res = await server.post("/player/guest", {
        name: name,
        socketId: socket.id,
      });

      const newPlayer = res.data;
      setPlayer(newPlayer);
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
