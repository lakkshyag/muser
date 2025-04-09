import Player from "./models/player.model.js";
import Lobby from "./models/lobby.model.js";

// "io" is the global socket.io server
// "socket" is the individually connected client 
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
          socket.to(lobbyCode).emit("player-joined", { // emit updated playerlist
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
          socket.leave(lobbyCode); // leave the socket.io room
          console.log(`Socket ${socket.id} left room ${lobbyCode}`);
      
          const lobby = await Lobby.findOne({ code: lobbyCode }).populate("players"); // get updated lobby with players
          if (!lobby) {
            console.log("Lobby not found after leave");
            return;
          }
      
          // Emit updated player list to others in the room
          socket.to(lobbyCode).emit("player-left", { // updat
            players: lobby.players,
            hostId: lobby.hostId.toString(), // send host ID too
          });
        } catch (err) {
          console.error("Socket leave-lobby error: ", err);
        }
      });

      socket.on("update-game-settings", ({ lobbyCode, settings }) => {
        // Optional: Validate lobbyCode, maybe check if socket is host (can add later)
        console.log(`[Server] Received settings update for lobby ${lobbyCode}`, settings);
        // Broadcast the settings to all clients in that lobby
        io.to(lobbyCode).emit("game-settings-updated", settings);
      });

      socket.on("start-game", ({ lobbyCode }) => {
        // Broadcast to everyone in the lobby
        io.to(lobbyCode).emit("game-started");
      });

      socket.on("disconnect", () => { // when client disconnects
        console.log("Socket disconnected:", socket.id);
      });  
    });
  }
  