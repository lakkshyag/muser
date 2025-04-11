import PlaylistManager from "./PlaylistManager";
import SongHistory from "./SongHistory";
import useLobbyStore from "../../stores/lobbyStore";
import useGameStore from "../../stores/gameStore";

const RightSection = () => {
  const gameStarted = useGameStore(state => state.gameStarted);

  return (
    <div className="w-full md:w-1/4 h-full border-l border-gray-700 p-4 overflow-y-auto">
      {gameStarted ? <SongHistory /> : <PlaylistManager />}
    </div>
  );
};

export default RightSection;