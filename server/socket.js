
export default function setupSocket(io) {
    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      socket.on("test", (data) => { // test
        console.log("Test event received:", data);
        socket.emit("test-response", { reply: "Server got your message!" });
      });

      socket.on("disconnect", () => { // test
        console.log("Client disconnected:", socket.id);
      });

      socket.on("join-lobby", ({ lobbyCode, player }) => {
        socket.join(lobbyCode);
        console.log(`${player.name} joined lobby ${lobbyCode}`);
        socket.to(lobbyCode).emit("player-joined", { player });
      });
  
      socket.on("leave-lobby", ({ lobbyCode, playerId }) => {
        socket.leave(lobbyCode);
        socket.to(lobbyCode).emit("player-left", { playerId });
        console.log(`${playerId} left lobby ${lobbyCode}`);
      });
      
    });
  }
  