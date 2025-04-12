import { useEffect, useState } from "react";
import server from "../../utils/server.js";
import socket from "../../utils/socket.js";
import usePlayerStore from "../../stores/playerStore.js";

const PlayerSection = () => {
  
  const { player, setPlayer, updatePlayerField } = usePlayerStore();
  // const [name, setName] = useState(player?.name || "");

  // useEffect(() => { // for the form, if global state already has values use that in the form;
  //   if (player?.name && player?.name !== player.name) {
  //     setName(player.name);
  //   }
  // }, [player?.name]);

  const handleNameInput = (e) => {
    const newName = e.target.value;
    updatePlayerField("name", newName);

    console.log("Input:", newName);
    console.log("Live Zustand name:", player?.name);
  };
  const handleGuestJoin = async () => { // for the guest join thing;
    if (!player || !player.name || !socket.id) { // no name entry or no socket id
      return alert("Please enter a name.");
    }

    if (player) { // if player already exists in the state;
      try { // use their id and see if db has that player id
        await server.delete(`/player/${player._id}`); // if yes, remove else it will cause inconsistency;
        console.log("Old player deleted"); 
        localStorage.removeItem("player_id");
      } catch (err) { // if unable to delete (99% times this will happen when that entry does not exist only);
        console.warn("Failed to delete old player", err);
      }
    }

    try { // now, we try to create the new player;
      const res = await server.post("/player/guest", {
        name: player.name, // name 
        socketId: socket.id, // from socket id (VERY IMP)
      });

      const newPlayer = res.data; // we get the player
      setPlayer(newPlayer); // setthe player as the zustand global state;
      localStorage.setItem("player_id", newPlayer._id); // and assign in local storage (just the id);

      socket.emit("guest-connected", newPlayer); // emmit that a new guest has connected;
      console.log("Guest player created:", newPlayer); // just for checking, can be removed
      alert(`Welcome, ${newPlayer.name}!`);
    } catch (err) {
      console.error("Failed to create guest player:", err);
      alert("Something went wrong, please try again.");
    }
  };

  return (
    <div className="text-center">
      <p className="text-lg mb-2">Join as Guest</p>

      <input
        type="text"
        placeholder="Enter your name"
        className="border px-3 py-2 rounded mb-3 w-60 text-black"
        value={player?.name || ""}
        onChange={handleNameInput}
      />

      <div className="flex justify-center">
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          onClick={handleGuestJoin}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PlayerSection;
