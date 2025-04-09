import usePlayerStore from "../stores/playerStore";
import useLobbyStore from "../stores/lobbyStore";
import { useEffect } from "react";

const useSyncHostStatus = () => {
  const { player, updatePlayerField } = usePlayerStore();
  const { hostId } = useLobbyStore();

  useEffect(() => {
    if (!player || !hostId) return;

    const shouldBeHost = player._id === hostId;

    if (player.isHost !== shouldBeHost) {
      updatePlayerField("isHost", shouldBeHost);
    }
  }, [player?._id, hostId]);
};

export default useSyncHostStatus;