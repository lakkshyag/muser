import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRestorePlayer from "../hooks/restorePlayer.js";
import useRestoreLobby from "../hooks/restoreLobby.js";
import LeftSidebar from "../components/Lobby/LeftSidebar.jsx";
import MiddleSection from "../components/Lobby/MiddleSection.jsx";
import RightSidebar from "../components/Lobby/RightSidebar.jsx"
import GameSettingsSync from "../components/SocketSync/GameSettingsSync.jsx";

const Lobby = () => {
  const navigate = useNavigate();
  const playerRestored = useRestorePlayer();   // returns true | false | null
  const lobbyRestored = useRestoreLobby(playerRestored === true); // only try once player is ready
  
  const [loading, setLoading] = useState(true);

  useEffect(() => { // this one is for the restore logic (handling refreshes);
    if (playerRestored === null || lobbyRestored === null) return; // react is making me go insane

    if (playerRestored === false || lobbyRestored === false) {
      navigate("/"); // return to home if either lobby or player zustand fail 
      return; 
    }

    if (playerRestored === true && lobbyRestored === true) {
      setLoading(false); // set loading as false if both player and lobby zustand get loaded
    }
  }, [playerRestored, lobbyRestored, navigate]);
  
  if (loading) return <div className="text-center mt-10">Loading lobby...</div>; // maybe make a cute loading animation afterwards?

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <GameSettingsSync />
      <LeftSidebar />
      <MiddleSection />
      <RightSidebar />
    </div>
  );
};

export default Lobby;
