import { useState, useEffect } from "react";
import usePlayerStore from "../../stores/playerStore.js";
import useLobbyStore from "../../stores/lobbyStore.js";
import useGameStore from "../../stores/gameStore.js";
import socket from "../../utils/socket.js";

const GameZone = () => {
  const { player } = usePlayerStore();
  const { code } = useLobbyStore();
  const {
    roundPhase,
    roundNumber,
    options,
    setRoundNumber,
    setOptions,
    setRoundPhase,
    setPlayerHasGuessed,
  } = useGameStore();

  const [selected, setSelected] = useState(null); // to highlight the selected option
  
  useEffect(() => {
    socket.on("round-start", ({ roundNumber, trackId, roundTime }) => {
      console.log("Received round-start:", { roundNumber, trackId });

      // Dummy MCQ options (hardcoded for now, to be replaced later)
      const dummyOptions = [
        "Song A", "Song B", "Song C", "Song D"
      ];

      console.log(dummyOptions);

      setRoundNumber(roundNumber);
      setOptions(dummyOptions); // In future, these come from backend
      setRoundPhase("guessing");
      setPlayerHasGuessed(false);
    });

    return () => {
      socket.off("round-start");
    };
  }, []);

  const handleGuess = (guess) => {
    setSelected(guess);
    socket.emit("submit-guess", {
      playerId: player._id,
      code,
      guess,
    });

    setPlayerHasGuessed(true);
    setRoundPhase("waiting"); // prevent multiple submissions
  };

  console.log(roundPhase);

  return (
    <div className="game-zone">
      <h2>Round {roundNumber}</h2>

      {roundPhase === "guessing" ? (
        <div className="mcq-options">
          {options.map((option, index) => (
            <button key={index} onClick={() => handleGuess(option)}>
              {option}
            </button>
          ))}
        </div>
      ) : roundPhase === "waiting" ? (
        <p>Waiting for other players to guess...</p>
      ) : (
        <p>Waiting for next round...</p>
      )}
    </div>
  );
};

export default GameZone;
