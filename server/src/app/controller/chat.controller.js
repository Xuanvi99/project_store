const {
  conversationModel,
  userModel,
  messageModel,
  imageModel,
} = require("../model");
const SocketIoService = require("../socket.io");
class chat {
  getConversation = async (req, res) => {
    const userId = req.params.id;
    try {
      let listConversation = await conversationModel
        .find({
          participants: { $in: [userId] },
        })
        .sort({ updateAt: -1 })
        .lean();

      res.status(200).json(listConversation);
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };

  getOneConversation = async (req, res) => {
    const userId = req.params.id;
    try {
      let listConversation = await conversationModel
        .findOne({
          participants: { $in: [userId] },
        })
        .lean();

      res.status(200).json(listConversation);
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };

  searchReceiver = async (req, res) => {
    const keyword = req.query.keyword;
    try {
      const listUser = await userModel
        .find({ $text: { $search: keyword } })
        .select("_id userName role")
        .lean();
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };

  getUsersChat = async (req, res) => {
    try {
      const search = req.query.search || "";
      const users = await userModel
        .find({
          $and: [
            { userName: { $regex: search, $options: "i" } },
            {
              role: { $in: ["buyer"] },
            },
          ],
        })
        .populate([{ path: "avatar", select: "_id public_id url folder" }]);
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };

  getMessage = async (req, res) => {
    const conversationId = req.params.conversationId;
    try {
      const activePage = +req.query.activePage || 1;
      const limit = +req.query.limit || 10;
      const skip = (activePage - 1) * limit;

      const conversation = await conversationModel
        .findById(conversationId)
        .lean();

      if (conversation) {
        await messageModel.updateMany(
          { conversationId },
          { $set: { seen: true } }
        );
      } else {
        return res.status(201).json([]);
      }

      const listMessage = await messageModel
        .find({ conversationId })
        .populate([
          {
            path: "imageIds",
            model: "images",
            select: "url",
          },
        ])
        .sort({ $natural: -1 })
        .skip(skip)
        .limit(limit);

      res.status(200).json(listMessage);
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };

  sendMessageText = async (req, res) => {
    try {
      const conversationId = req.params.id;
      const { senderId, receiverId, text } = body;

      let conversation = await conversationModel.findOne({
        participants: { $all: [senderId, receiverId] },
      });
      if (!conversation) {
        conversation = await conversationModel.create({
          participants: [senderId, receiverId],
        });
      }

      const newMessage = new messageModel({
        conversationId,
        senderId,
        receiverId,
        messageType: "text",
        text,
      });

      await Promise.all([conversation.save(), newMessage.save()]); // run parallel

      const receiverSocketId = SocketIoService.getUserSocketMap(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };

  sendMessageImages = async (req, res) => {
    a;
    try {
      const conversationId = req.params.id;
      const { files, body } = req;
      const { senderId, receiverId } = body;

      let conversation = await conversationModel.findOne({
        participants: { $all: [senderId, receiverId] },
      });
      if (!conversation) {
        conversation = await conversationModel.create({
          participants: [senderId, receiverId],
        });
      }

      const imageIds = await imageModel.uploadMultipleFile(
        files.images,
        "messages"
      );

      const newMessage = new messageModel({
        conversationId,
        senderId,
        receiverId,
        messageType: "image",
        imageIds,
      });

      await Promise.all([conversation.save(), newMessage.save()]);

      const receiverSocketId = SocketIoService.getUserSocketMap(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };
}

module.exports = new chat();
