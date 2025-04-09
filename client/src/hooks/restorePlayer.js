import { useEffect, useState } from "react";
import server from "../utils/server.js";
import socket from "../utils/socket.js";
import usePlayerStore from "../stores/playerStore";

const useRestorePlayer = () => { // for restoring zustand with truth from db;
  // const [loading, setLoading] = useState(true); 
  const { setPlayer, resetPlayer } = usePlayerStore(); // zustand truth;
  const [restored, setRestored] = useState(null); // null -> in prog, true means done false means bad, dont proceed;

  useEffect(() => {
    const restorePlayer = async () => { // the function;
      const storedId = localStorage.getItem("player_id"); // id from local storage;
      if (!storedId) {
        setRestored(false); // if doesnt exist, we're done here
        return;
      }

      try { // try getting the user from the db;
        const res = await server.get(`/player/${storedId}`);
        const fetchedPlayer = res.data;
        let finalPlayer = fetchedPlayer;
        
        if (fetchedPlayer.socketId !== socket.id) { // if db socket doesnt match,
          await server.put(`/player/${fetchedPlayer._id}`, { // then we have to update since
            socketId: socket.id, // socket id truth is client side;
          });
        }
        
        finalPlayer = { ...fetchedPlayer, socketId: socket.id }; // updating local copy socket id;
        setPlayer(finalPlayer); // update zustand with db truth;

        socket.emit("guest-connected", finalPlayer); // emit socket with correct info;
        console.log("Player restored:", finalPlayer); // for testing;
        setRestored(true); // good, can proceed;
      } catch (err) { // if for whatever reason unable to get user from db or udpdate;
        console.warn("Failed to restore player, clearing local storage:", err); 
        localStorage.removeItem("player_id"); // then just clear this user id from storage;
        resetPlayer(); // and reset;
        alert("Your session expired. Please refresh.");
        setRestored(false); // bad, dont proceed;
      }
    };

    if (socket.connected) { // extremely bandaid fix but
      restorePlayer(); // this will  for a restore on this page;
    } else { 
      socket.on("connect", restorePlayer); // else if new socket due to whatever, we still have this;
    }

    return () => {
      socket.off("connect", restorePlayer);
    };
  }, []);

  return restored;
};

export default useRestorePlayer;
