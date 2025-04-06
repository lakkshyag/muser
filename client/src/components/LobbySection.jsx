import React from "react";

const LobbySection = () => {
  return (
    <div className="text-center">
      <p className="text-lg mb-2">Room Options:</p>
      <div className="flex gap-4 justify-center">
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
          Create Room
        </button>
        <button className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded">
          Join Room
        </button>
      </div>
    </div>
  );
};

export default LobbySection;
