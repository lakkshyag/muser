// import React, { useState } from 'react';

// const Player = () => {
//   const [audio, setAudio] = useState(null);

//   const previewUrl = "https://p.scdn.co/mp3-preview/6c898de17e8b67d6fddabf8239d7a184ff72ec5d?cid=YOUR_CLIENT_ID"; // Replace with a valid preview URL

//   const handlePlay = () => {
//     if (audio) {
//       audio.pause(); // Stop previous
//     }
//     const newAudio = new Audio(previewUrl);
//     setAudio(newAudio);
//     newAudio.play();
//   };

//   const handlePause = () => {
//     if (audio) {
//       audio.pause();
//     }
//   };

//   return (
//     <div className="flex flex-col items-center mt-10">
//       <button onClick={handlePlay} className="bg-green-500 text-white p-2 rounded m-2">Play Preview</button>
//       <button onClick={handlePause} className="bg-red-500 text-white p-2 rounded m-2">Pause</button>
//     </div>
//   );
// };

// export default Player;
