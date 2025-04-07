import { useEffect } from "react";
import server from "../utils/server.js";
import usePlayerStore from "../stores/playerStore";
import useLobbyStore from "../stores/lobbyStore";

const useRestoreLobby = () => { // assume useRestorePlayer() has been called before this
  const { player } = usePlayerStore(); // get the zustand player state
  const { setLobby, resetLobby } = useLobbyStore(); // get the zustand lobby state;

  useEffect(() => {
    const restoreLobby = async () => { // if player doesnt exist in state, then lobby should not be accessed
      if (!player || !player.lobbyCode) return;  // also if plyer exists but without a state, then dont access this;

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
      } catch (err) { // for whatever reasons, if this fails 
        console.warn("Failed to restore lobby:", err);
        resetLobby(); // reset the lobby and go home;
        alert("Failed to restore lobby. Returning to home.");
      }
    };

    restoreLobby();
  }, [player]);
};

export default useRestoreLobby;