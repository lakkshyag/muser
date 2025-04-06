
export default function setupSocket(io) {
    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);

      socket.on("guest-connected", (player) => {
        console.log(`Guest ${player.name} connected with ID ${player._id}`);
        // You can save socket.id to player model here later if needed
      });
    
      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
      });
      
    });
  }
  