import Player from "./models/player.model.js";
import Lobby from "./models/lobby.model.js";

export default function setupSocket(io) {
    io.on("connection", (socket) => { // when client connects
      console.log("Socket connected:", socket.id);

      socket.on("guest-connected", (player) => { // when a guest account is created;
        console.log(`Guest ${player.name} connected with ID ${player._id}`);
      });
    
      socket.on("join-lobby", async ({ playerId, lobbyCode }) => { // when a player joins lobby
        console.log("emitting join lobby 2");

        try {
          const lobby = await Lobby.findOne({ code: lobbyCode }).populate("players"); // updated lobby from db;
          if (!lobby) {
            console.log("Lobby not found");
            return;
          }

          console.log(lobby);

          socket.join(lobbyCode); // join the socket.io room
          socket.to(lobbyCode).emit("player-joined", {
            players: lobby.players,
            hostId: lobby.hostId.toString(),
          });
        } catch (err) {
          console.error("Socket join-lobby error: ", err);
        }
      });

      socket.on("leave-lobby", async ({ playerId, lobbyCode }) => {
        console.log("emitting leave lobby 2");
        try {      
          // Leave the socket.io room
          socket.leave(lobbyCode);
          console.log(`Socket ${socket.id} left room ${lobbyCode}`);
      
          // Get the updated lobby with players
          const lobby = await Lobby.findOne({ code: lobbyCode }).populate("players");
          if (!lobby) {
            console.log("Lobby not found after leave");
            return;
          }
      
          // Emit updated player list to others in the room
          socket.to(lobbyCode).emit("player-left", {
            players: lobby.players,
            hostId: lobby.hostId.toString(), // send host ID too
          });
        } catch (err) {
          console.error("Socket leave-lobby error: ", err);
        }
      });

      socket.on("disconnect", () => { // when client disconnects
        console.log("Socket disconnected:", socket.id);
      });  
    });
  }
  