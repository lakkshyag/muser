import Player from "../models/player.model.js";

// create a guest player, name is REQUIRED, can be duplicate as well 
// mght also need to gneerate socket id and give it to player here only;
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
