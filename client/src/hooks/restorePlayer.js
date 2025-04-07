import { useEffect } from "react";
import server from "../utils/server.js";
import socket from "../utils/socket.js";
import usePlayerStore from "../stores/playerStore";

const useRestorePlayer = () => {
  const { setPlayer, resetPlayer } = usePlayerStore();

  useEffect(() => {
    const restorePlayer = async () => {
      const storedId = localStorage.getItem("player_id");
      if (!storedId) return;

      try {
        const res = await server.get(`/player/${storedId}`);
        const fetchedPlayer = res.data;

        setPlayer(fetchedPlayer);

        if (fetchedPlayer.socketId !== socket.id) {
          await server.put(`/player/${fetchedPlayer._id}`, {
            socketId: socket.id,
          });
        }

        socket.emit("guest-connected", {
          ...fetchedPlayer,
          socketId: socket.id,
        });

        console.log("Player restored:", fetchedPlayer);
        console.log("with updated socket id: ", socket.id);
      } catch (err) {
        console.warn("Failed to restore player, clearing local storage:", err);
        localStorage.removeItem("player_id");
        resetPlayer();
        alert("Your session expired. Please refresh.");
      }
    };

    socket.on("connect", restorePlayer);

    return () => {
      socket.off("connect", restorePlayer);
    };
  }, []);
};

export default useRestorePlayer;
