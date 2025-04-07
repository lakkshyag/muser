import { useEffect, useState } from "react";
import server from "../utils/server.js";
import usePlayerStore from "../stores/playerStore";
import useLobbyStore from "../stores/lobbyStore";

const useRestoreLobby = (shouldRestore) => { // assume useRestorePlayer() has been called before this
  const { player } = usePlayerStore(); // get the zustand player state
  const { setLobby, resetLobby } = useLobbyStore(); // get the zustand lobby state;
  const [restored, setRestored] = useState(null); // null -> in prog, true means done false means bad, dont proceed;

  useEffect(() => {
    if (!shouldRestore) return;

    const restoreLobby = async () => { // if player doesnt exist in state, 
      if (!player || !player.lobbyCode) { // or doesnt have code, then lobby shouldnt be accessed;
        setRestored(false);
        return; 
      }

      try { // get the db truth for the lobby using the code w/ the player;
        const res = await server.get(`/lobby/${player.lobbyCode}`);
        const {lobby: fetchedLobby} = res.data;

        setLobby({ // update zustand lobby state wrt the db truth;
          code: fetchedLobby.code,
          hostId: fetchedLobby.hostId,
          players: fetchedLobby.players,
          playlistIds: fetchedLobby.playlistIds ?? [],
          status: fetchedLobby.status ?? "waiting",
        });

        console.log("Lobby restored:", fetchedLobby);
        setRestored(true);
      } catch (err) { // for whatever reasons, if this fails 
        console.warn("Failed to restore lobby:", err);
        resetLobby(); // reset the lobby and go home;
        alert("Failed to restore lobby. Returning to home.");
        setRestored(false);
      }
    };

    restoreLobby();
  }, [player]);

  return restored;
};

export default useRestoreLobby;