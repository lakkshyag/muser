import { useEffect } from "react";
import socket from "../../utils/socket.js";
import useGameStore from "../../stores/gameStore.js";

const GameSettingsSync = () => {
  useEffect(() => {
    const {
      setTotalRounds,
      setRoundTime,
      setInputMode,
      setGameMode,
      setGameStarted
    } = useGameStore.getState();

    const handleGameSettingsUpdate = (settings) => {
      console.log("[GameSettingsSync] Received settings update:", settings);
      setTotalRounds(settings.totalRounds);
      setRoundTime(settings.roundTime);
      setInputMode(settings.inputMode);
      setGameMode(settings.gameMode);
    };

    const handleGameStarted = () => {
      console.log("[GameSettingsSync] Game started");
      setGameStarted(true);
    };

    socket.on("game-settings-updated", handleGameSettingsUpdate);
    socket.on("game-started", handleGameStarted);

    return () => {
      socket.off("game-settings-updated", handleGameSettingsUpdate);
      socket.off("game-started", handleGameStarted);
    };
  }, []);

  return null; // this component does not render anything
};

export default GameSettingsSync;
