import useLobbyStore from "../../stores/lobbyStore.js";
import useGameStore from "../../stores/gameStore.js";
import SourceManager from "./SourceManager.jsx"


const RightSection = () => {
  const gameStarted = useGameStore(state => state.gameStarted);

  return (
    <div className="w-full md:w-1/4 h-full border-l border-gray-700 p-4 overflow-y-auto">
      {/* {gameStarted ? <SongHistory /> : <PlaylistManager />} */}
      <SourceManager />
    </div>
  );
};

export default RightSection;