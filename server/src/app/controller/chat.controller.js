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
      const populateParticipants = [
        {
          path: "participants",
          model: "users",
          populate: {
            path: "avatar",
            model: "images",
            select: "url",
          },
        },
      ];

      let conversation = await conversationModel
        .findOne({
          participants: userId,
        })
        .populate(populateParticipants)
        .lean();

      if (!conversation) {
        const admin = await userModel.findOne({ role: "admin" }).lean();
        const newConversation = await conversationModel.create({
          participants: [userId, admin._id],
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
    const limit = +req.query.limit;
    const skip = +req.query.skip || 0;
    try {
      const messages = await messageModel
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
        const updatedConversation = await conversationModel.findByIdAndUpdate(
          conversationId,
          {
            $inc: { totalMessage: 1 },
            messageLasterId: savedMessage._id,
          },
          { new: true } // Trả về document sau khi update
        );

        const populateOptions = [
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
        ];

        const message = await messageModel
          .findById(savedMessage._id)
          .populate(populateOptions)
          .lean();

        // Gửi tin nhắn realtime qua Socket.IO
        const receiverSocketId = SocketIoService.getUserSocketMap(
          body.receiverId
        );
        if (receiverSocketId) {
          _io.to(receiverSocketId).emit("receiveMessage", {
            conversationId,
            message,
            totalMessage: updatedConversation.totalMessage,
          });
        }
        return res
          .status(201)
          .json({ message, totalMessage: updatedConversation.totalMessage });
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

  getImagesInConversation = async () => {
    try {
      const conversationId = req.params.conversationId;
      const conversation = await conversationModel.findById(conversationId);
      if (conversation) {
        const unreadMessages = await messageModel.find;
        return res.status(200).json({ amount: unreadMessages });
      }
      res.status(404).json({ errorMessage: "conversation not found" });
    } catch (error) {
      res.status(500).json({ errMessage: error || "server error" });
    }
  };
}

module.exports = new chat();
