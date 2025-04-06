import { useEffect, useState } from "react";
import server from "../utils/server";
import socket from "../utils/socket";

const PlayerSection = () => {
  const [name, setName] = useState("");
  const [socketId, setSocketId] = useState(null);
  const [playerId, setPlayerId] = useState(null);

  useEffect(() => { // socket id on connect;
    socket.on("connect", () => {
      console.log("Socket connected with ID:", socket.id);
      setSocketId(socket.id); // will change upon every revresh and nav, so keep updating these

      // try to refresh session if local sotrage already has id;
      const storedPlayer = JSON.parse(localStorage.getItem("player"));
      if (storedPlayer && storedPlayer._id) {
        server
          .get(`/player/${storedPlayer._id}`)
          .then((res) => {
            const player = res.data;
            setName(player.name);
            setPlayerId(player._id);

            // update socket ID on backend (since it's changed)
            return server.put(`/player/${player._id}`, {
              socketId: socket.id,
            });
          })
          .then(() => {
            console.log("Restored and updated player socket ID");
            // emit again:
            socket.emit("guest-connected", {
              _id: storedPlayer._id,
              name: storedPlayer.name,
              socketId: socket.id,
            });

          })
          .catch((err) => {
            console.warn("Player restoration failed, clearing localStorage");
            localStorage.removeItem("player");
          });
      }

    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }, []);

  const handleChange = (e) => {
    setName(e.target.value);
    // console.log(name);
  };

  const handleGuestJoin = async () => {
    if (!name || !socketId) {
        return alert("Please enter a name.");
    }

    // If player exists, delete them first from DB
    if (playerId) {
      try {
        await server.delete(`/player/${playerId}`);
        localStorage.removeItem("player");
        console.log("Old player deleted");
      } catch (err) {
        console.warn("Failed to delete old player", err);
      }
    }

    try {
      const res = await server.post("/player/guest", { name, socketId });
      const player = res.data;

      console.log(player);

      // Save to localStorage
      localStorage.setItem("player", JSON.stringify(player)); 

      // Send info to backend via socket
      socket.emit("guest-connected", player);

      console.log("Guest player created:", player);
      alert(`Welcome, ${player.name}!`);

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
        className="border px-3 py-2 rounded mb-3 w-60 text-black p-2"
        // className="border border-gray-400 "
        value={name}
        onChange={handleChange}
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
