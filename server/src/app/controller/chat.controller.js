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
        .populate([
          {
            path: "participants",
            model: "users",
            populate: {
              path: "avatar",
              model: "images",
              select: "url",
            },
          },
        ])
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
        .populate([
          {
            path: "participants",
            model: "users",
            populate: {
              path: "avatar",
              model: "images",
              select: "url",
            },
          },
        ])
        .lean();

      if (!conversation) {
        const admin = await userModel.findOne({ role: "admin" }).lean();
        const newConversation = await conversationModel.create({
          participants: [id, admin._id],
        });
        conversation = await conversationModel
          .findById(newConversation._id)
          .populate([
            {
              path: "participants",
              model: "users",
              populate: {
                path: "avatar",
                model: "images",
                select: "url",
              },
            },
          ])
          .lean();
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
              path: "imagesId",
              model: "images",
              select: "url width height",
            },
            {
              path: "senderId",
              model: "users",
              populate: {
                path: "avatar",
                model: "images",
                select: "url",
              },
            },
            {
              path: "receiverId",
              model: "users",
              populate: {
                path: "avatar",
                model: "images",
                select: "url",
              },
            },
          ])
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean();
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
      const message = await messageModel.findById(messageId).populate([
        {
          path: "imagesId",
          model: "images",
          select: "url width height",
        },
        {
          path: "senderId",
          model: "users",
          populate: {
            path: "avatar",
            model: "images",
            select: "url",
          },
        },
        {
          path: "receiverId",
          model: "users",
          populate: {
            path: "avatar",
            model: "images",
            select: "url",
          },
        },
      ]);
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

  sendMessageTextAndEmoji = async (req, res) => {
    try {
      const conversationId = req.params.conversationId;
      const { createdAt, ...body } = req.body;

      const newMessage = new messageModel({ conversationId, ...body });

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

        const message = await messageModel
          .findById(savedMessage._id)
          .populate([
            {
              path: "senderId",
              model: "users",
              populate: {
                path: "avatar",
                model: "images",
                select: "url",
              },
            },
            {
              path: "receiverId",
              model: "users",
              populate: {
                path: "avatar",
                model: "images",
                select: "url",
              },
            },
          ])
          .lean();

        // Gửi tin nhắn realtime qua Socket.IO
        const receiverSocketId = SocketIoService.getUserSocketMap(
          body.receiverId
        );
        if (receiverSocketId) {
          _io.to(receiverSocketId).emit("receiveMessage", {
            conversationId,
            message,
            totalMessage: messageCount,
          });
        }
        return res.status(201).json({ message, totalMessage: messageCount });
      }
      res.status(400).json({ errorMessage: "error sender message text" });
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  sendMessageImages = async (req, res) => {
    try {
      const conversationId = req.params.conversationId;
      const { files, body } = req;
      const { senderId, receiverId, receiverSeen } = body;

      const imagesId = await imageModel.uploadMultipleFile(files, "message");

      const savedMessage = new messageModel({
        conversationId,
        senderId,
        receiverId,
        messageType: "image",
        imagesId,
        receiverSeen: receiverSeen === "false" ? false : true,
      });

      await savedMessage.save();

      if (savedMessage) {
        // Cập nhật thông tin cuộc trò chuyện
        const messageCount = await messageModel.countDocuments({
          conversationId,
        });

        await conversationModel.findByIdAndUpdate(conversationId, {
          totalMessage: messageCount,
          messageLasterId: savedMessage._id,
        });

        const newMessage = await messageModel
          .findById(savedMessage._id)
          .populate([
            {
              path: "imagesId",
              model: "images",
              select: "url width height",
            },
            {
              path: "senderId",
              model: "users",
              populate: {
                path: "avatar",
                model: "images",
                select: "url",
              },
            },
            {
              path: "receiverId",
              model: "users",
              populate: {
                path: "avatar",
                model: "images",
                select: "url",
              },
            },
          ])
          .lean();

        // Gửi tin nhắn realtime qua Socket.IO
        const receiverSocketId = SocketIoService.getUserSocketMap(receiverId);
        if (receiverSocketId) {
          _io.to(receiverSocketId).emit("receiveMessage", {
            conversationId,
            message: newMessage,
            totalMessage: messageCount,
          });
        }
        return res
          .status(201)
          .json({ message: newMessage, totalMessage: messageCount });
      }
      res.status(400).json({ errorMessage: "error sender message image" });
    } catch (error) {
      res.status(500).json({ errMessage: error || "server error" });
    }
  };

  unreadMessage = async (req, res) => {
    try {
      const conversationId = req.params.conversationId;
      const userId = req.query.userId;
      const conversation = await conversationModel.findById(conversationId);
      if (conversation) {
        const unreadMessages = await messageModel
          .countDocuments({
            $and: [
              { conversationId },
              { receiverId: userId },
              { receiverSeen: false },
            ],
          })
          .exec();
        return res.status(200).json({ amount: unreadMessages });
      }
      res.status(404).json({ errorMessage: "conversation not found" });
    } catch (error) {
      res.status(500).json({ errMessage: error || "server error" });
    }
  };
}

module.exports = new chat();
