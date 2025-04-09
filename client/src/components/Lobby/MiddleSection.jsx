import useGameStore from "../../stores/gameStore.js";
import GameSettings from "./GameSettings";
import GameZone from "./GameZone";

const MiddleSection = () => {
  const gameStarted = useGameStore((state) => state.gameStarted);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {gameStarted ? <GameZone /> : <GameSettings />}
    </div>
  );
};

export default MiddleSection;
