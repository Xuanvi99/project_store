const { roomChatModel, userModel } = require("../model");

class RoomChat {
  getRoomChatBuyer = async (req, res) => {
    const buyerId = req.params.buyerId;
    try {
      const roomChat = await roomChatModel
        .findOne({
          participants: { $in: [buyerId] },
        })
        .lean();

      if (!roomChat) {
        const admin = await userModel.findOne({ role: "admin" }).lean();

        const newRoom = new roomChatModel({
          participants: [buyerId, admin._id],
        });

        const result = await newRoom.save();
        return res.status(200).json(result);
      }
      res.status(200).json(roomChat);
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };

  getRoomChatAdmin = async (req, res) => {
    const adminId = req.query.adminId;
    const buyerId = req.query.buyerId;
    try {
      const roomChat = await roomChatModel
        .findOne({
          participants: { $all: [adminId, buyerId] },
        })
        .lean();

      if (!roomChat) {
        const newRoom = new roomChatModel({
          participants: [adminId, buyerId],
        });

        const result = await newRoom.save();
        return res.status(200).json(result);
      }
      res.status(200).json(roomChat);
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };
}

module.exports = new RoomChat();
