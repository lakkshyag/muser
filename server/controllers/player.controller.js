import Player from "../models/player.model.js";

// create a guest player, name is REQUIRED, can be duplicate as well 
// mght also need to gneerate socket id and give it to player here only <- socket id shenanigans done;
export const createGuestPlayer = async (req, res) => {
    try {
        const { name, socketId } = req.body;
        if (!name || !socketId) {
            return res.status(400).json({ error: "Player and Socket ID name are required" });
        }

        // only name required, will be using mongodb assigned ids because why not;
        const newPlayer = new Player({
            name,
            socketId
        });

        await newPlayer.save();
        return res.status(201).json(newPlayer);
    } catch (error) {
        console.error("Error creating guest player:", error);
        return res.status(500).json({ error: "Failed to create guest player" });
    }
};

// normal fetch for players;
export const getPlayerById = async (req, res) => {
    const { id } = req.params;
    try {
      const player = await Player.findById(id);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      res.status(200).json(player);
    } catch (err) {
      console.error("Error fetching player:", err);
      res.status(500).json({ message: "Server error" });
    }
};
  
// deleting an old player for db cleanup
export const deletePlayerById = async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await Player.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: "Player not found" });
      }
      res.status(200).json({ message: "Player deleted successfully" });
    } catch (err) {
      console.error("Error deleting player:", err);
      res.status(500).json({ message: "Server error" });
    }
};

// updating old socket id since it keeps getting refreshed;
export const updatePlayerSocketId = async (req, res) => {
    const { id } = req.params;
    const { socketId } = req.body;
  
    try {
      const updatedPlayer = await Player.findByIdAndUpdate(
        id,
        { socketId },
        { new: true }
      );
  
      if (!updatedPlayer) {
        return res.status(404).json({ message: "Player not found" });
      }
  
      res.json(updatedPlayer);
    } catch (err) {
      console.error("Error updating socket ID:", err);
      res.status(500).json({ message: "Server error" });
    }
};