import { useEffect, useState } from "react";
import useGameStore from "../../stores/gameStore.js";
import useLobbyStore from "../../stores/lobbyStore.js"
import usePlayerStore from "../../stores/playerStore.js";
import socket from "../../utils/socket.js";
import server from "../../utils/server.js";

const emitGameSettingsUpdate = async () => {
  const {
    totalRounds,
    roundTime,
    gameMode,
    inputMode
  } = useGameStore.getState();

  const { player } = usePlayerStore.getState();
  const { code } = useLobbyStore.getState();
  const settings = {
    totalRounds,
    roundTime,
    gameMode,
    inputMode,
  };
  
  try { // posting the game settings
    await server.post(`/lobby/${code}/game-settings`, {
      settings,
      playerId: player._id,
    });

    socket.emit("update-game-settings", { // emitting on the server
      lobbyCode : code,
      settings,
    }); 
  } catch (err) {
    console.error("Failed to update game settings:", err);
    alert("Error saving game settings. Please try again.");
  }
};

const GameSettings = () => {
  const {
    gameStarted,
    totalRounds,
    roundTime,
    inputMode,
    gameMode,
    setTotalRounds,
    setRoundTime,
    setInputMode,
    setGameMode,
    setGameStarted,
  } = useGameStore();

  const { code } = useLobbyStore();
  const isHost = usePlayerStore((state) => state.player?.isHost);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    console.log("isHost updated:", isHost);
  }, [isHost]);

  const handleStartGame = () => {
    if (isHost) {
      setGameStarted(true);
      const { lobbyCode } = useLobbyStore.getState();
      socket.emit("start-game", { lobbyCode });
      // socket emit will go here later
    }
  };

  useEffect(() => {
    const fetchAndSetSettings = async () => {

      setLoadingSettings(true);
      console.log("fetching from db");

      try {
        const res = await server.get(`/lobby/${code}/game-settings`);
        const settings = res.data;

        setTotalRounds(settings.totalRounds);
        setRoundTime(settings.roundTime);
        setInputMode(settings.inputMode);
        setGameMode(settings.gameMode);
      } catch (err) {
        console.error("Failed to fetch game settings:", err);
      } finally {
        setLoadingSettings(false);
      }
    };
  
    fetchAndSetSettings();
  }, [code]);

  if (loadingSettings) return <div className="text-center mt-10">Loading Game Settings...</div>; // maybe make a cute loading animation afterwards?

  return (
    <div className="bg-white rounded shadow p-6 w-full max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Game Settings</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Total Rounds</label>
        <input
          type="number"
          value={totalRounds}
          onChange={(e) => {
            setTotalRounds(Number(e.target.value));
            if (isHost) emitGameSettingsUpdate();
          }}
          disabled={!isHost}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Time per Round (seconds)</label>
        <input
          type="number"
          value={roundTime}
          onChange={(e) => {
            setRoundTime(Number(e.target.value));
            if (isHost) emitGameSettingsUpdate();
          }}
          disabled={!isHost}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Game Mode</label>
        <select
          value={gameMode}
          onChange={(e) => {
            setGameMode(e.target.value);
            if (isHost) emitGameSettingsUpdate();
          }}
          disabled={!isHost}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="guess-song">Guess Song</option>
          <option value="guess-artist">Guess Artist</option>
          <option value="guess-album">Guess Album</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium">Input Mode</label>
        <select
          value={inputMode}
          onChange={(e) => {
            setInputMode(e.target.value);
            if (isHost) emitGameSettingsUpdate();
          }}
          disabled={!isHost}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="mcq">Multiple Choice</option>
          <option value="typing">Typing</option>
        </select>
      </div>

      {isHost && (
        <button
          onClick={handleStartGame}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Start Game
        </button>
      )}
    </div>
  );
};

export default GameSettings;
