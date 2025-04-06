// client/src/pages/Lobby.jsx
import React from "react";
import { useParams } from "react-router-dom";

function Lobby() {
  const { code } = useParams();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Lobby Code: {code}</h1>
      <p>Player list, settings, and game UI will go here.</p>
    </div>
  );
}

export default Lobby;
