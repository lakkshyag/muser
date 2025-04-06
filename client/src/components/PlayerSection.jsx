import { useEffect, useState } from "react";
import server from "../utils/server";
import { io } from "socket.io-client";

// Connect socket outside component scope
const socket = io("http://localhost:5000", {
    withCredentials: true
});

const PlayerSection = () => {
  const [name, setName] = useState("");
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected with ID:", socket.id);
      setSocketId(socket.id); // Save socket ID for later
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

    try {
      const res = await server.post("/player/guest", { name, socketId });
      const player = res.data;

      console.log(player);

      // Save to localStorage
      localStorage.setItem("muser_player", JSON.stringify(player));

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
