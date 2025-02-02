const {
  conversationModel,
  userModel,
  messageModel,
  imageModel,
} = require("../model");
const SocketIoService = require("../socket.io");
class chat {
  getConversations = async (req, res) => {
    const userId = req.params.id;
    try {
      let listConversation = await conversationModel
        .find({
          $and: [
            { participants: { $in: [userId] } },
            { totalMessage: { $gt: 0 } },
          ],
        })
        .sort({ updatedAt: -1 })
        .lean();

      res.status(200).json(listConversation);
    } catch (error) {
      res.status(500).json({ errMessage: error || "server error" });
    }
  };

  getOneConversation = async (req, res) => {
    const userId = req.params.id;
    try {
      let conversation = await conversationModel
        .findOne({
          participants: { $in: [userId] },
        })
        .lean();

      if (!conversation) {
        const admin = await userModel.findOne({ role: "admin" }).lean();
        conversation = await conversationModel.create({
          participants: [id, admin._id],
        });
      }

      res.status(200).json(conversation);
    } catch (error) {
      res.status(500).json({ errMessage: error || "server error" });
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
      res.status(500).json({ errMessage: error || "server error" });
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
      res.status(200).json(users ? users : []);
    } catch (error) {
      res.status(500).json({ errMessage: error || "server error" });
    }
  };

  getMessages = async (req, res) => {
    const conversationId = req.params.conversationId;
    try {
      const limit = +req.query.limit;
      const skip = +req.query.skip;

      const conversation = await conversationModel
        .findById(conversationId)
        .lean();

      let messages = [];
      if (conversation) {
        messages = await messageModel
          .find({ conversationId })
          .populate([
            {
              path: "imageIds",
              model: "images",
              select: "url",
            },
          ])
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
      } else {
        return res.status(201).json([]);
      }
      res.status(200).json(messages.reverse());
    } catch (error) {
      res.status(500).json({ errMessage: error || "server error" });
    }
  };

  getOneMessage = async (req, res) => {
    const messageId = req.params.messageId;
    try {
      const message = await messageModel.findById(messageId);
      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ errMessage: error || "server error" });
    }
  };

  seenMessages = async (req, res) => {
    const conversationId = req.params.conversationId;
    try {
      let userId = req.body.userId;

      const conversation = await conversationModel
        .findById(conversationId)
        .lean();

      if (conversation) {
        await messageModel.updateMany(
          {
            $and: [{ conversationId: conversationId }, { receiverId: userId }],
          },
          { $set: { receiverSeen: true } }
        );
      }
      res.status(200).json("update success");
    } catch (error) {
      res.status(500).json({ errMessage: error || "server error" });
    }
  };

  sendMessageText = async (req, res) => {
    try {
      const conversationId = req.params.conversationId;
      const { senderId, receiverId, text, receiverSeen } = req.body;

      const newMessage = new messageModel({
        conversationId,
        senderId,
        receiverId,
        messageType: "text",
        text,
        receiverSeen,
      });

      const savedMessage = await newMessage.save();

      if (savedMessage) {
        // Cập nhật thông tin cuộc trò chuyện
        const messageCount = await messageModel.countDocuments({
          conversationId,
        });

        await conversationModel.findByIdAndUpdate(conversationId, {
          totalMessage: messageCount,
          messageLasterId: savedMessage._id,
        });

        // Gửi tin nhắn realtime qua Socket.IO
        const receiverSocketId = SocketIoService.getUserSocketMap(receiverId);
        if (receiverSocketId) {
          _io.to(receiverSocketId).emit("receiveMessage", {
            conversationId,
            message: savedMessage._doc,
          });
        }
      }
      res.status(201).json(savedMessage._doc);
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  sendMessageImages = async (req, res) => {
    a;
    try {
      const conversationId = req.params.id;
      const { files, body } = req;
      const { senderId, receiverId } = body;

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

      await newMessage.save();

      const receiverSocketId = SocketIoService.getUserSocketMap(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ errMessage: error || "server error" });
    }
  };
}

module.exports = new chat();
