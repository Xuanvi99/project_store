const { messageModel } = require("../model");
class Message {
  getListMessage = async () => {
    const romChatId = req.params.romChatId;
    try {
      const activePage = +req.query.activePage || 1;
      const limit = +req.query.limit || 10;
      const skip = (activePage - 1) * limit;

      await messageModel.updateMany({ romChatId }, { $set: { seen: true } });

      const listMessage = await messageModel
        .find({ romChatId })
        .populate([
          {
            path: "senderId",
            model: "users",
            select: "_id userName role",
          },
          { path: "receiverId", model: "users", select: "_id userName role" },
          {
            path: "imageIds",
            model: "images",
            select: "url",
          },
        ])
        .sort({ $natural: -1 })
        .skip(skip)
        .limit(limit);

      res.status(200).json({ listMessage });
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };

  sendMessage = async (req, res) => {
    try {
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };
}

module.exports = new Message();
