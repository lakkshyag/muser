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
      
          socket.to(lobbyCode).emit("player-left", { // updated player list to others in the room
            players: lobby.players,
            hostId: lobby.hostId.toString(), // send host ID too
          });
        } catch (err) {
          console.error("Socket leave-lobby error: ", err);
        }
      });

      socket.on("update-game-settings", ({ lobbyCode, settings }) => {
        console.log(`received settings update for lobby ${lobbyCode}`, settings);
        io.to(lobbyCode).emit("game-settings-updated", settings); // broadcast settings in the lobby
      });

      socket.on("update-sources", ({ code, sources }) => { // whenever playlists / albums change in the lobby
        socket.to(code).emit("update-sources", { sources });
      });

      socket.on("start-game", ({ lobbyCode }) => {
        io.to(lobbyCode).emit("game-started"); // Broadcast to everyone in the lobby (in prog);
      });

      socket.on("disconnect", () => { // when client disconnects
        console.log("Socket disconnected:", socket.id);
      });  
    });
  }
  