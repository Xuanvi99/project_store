const { userModel } = require("../model/index");
class SocketIoService {
  constructor() {
    this.userSocketMap = {};
  }

  getUserSocketMap = (receiverId) => {
    return this.userSocketMap[receiverId];
  };

  connect = async (socket) => {
    console.log("Client connected " + socket.id);
    const userId = socket.handshake.auth.id;

    const user = await userModel.findById(userId);

    if (user) {
      this.userSocketMap[userId] = socket.id;
      await userModel.findByIdAndUpdate(userId, { status: "online" });
    }

    _io.emit("getOnlineUsers", Object.keys(this.userSocketMap));

    socket.on("typing", async (data) => {
      const { receiverId, typing } = data;
      const receiverSocketId = this.userSocketMap[receiverId];
      if (typing) {
        _io
          .to(receiverSocketId)
          .emit("displayTyping", { typing: true, senderId: userId });
      } else {
        _io
          .to(receiverSocketId)
          .emit("displayTyping", { typing: false, senderId: userId });
      }
    });

    // check receiver seen message
    socket.on("seenConversation", async (data) => {
      const { receiverId, seen, conversationId } = data;
      const receiverSocketId = this.userSocketMap[receiverId];
      _io
        .to(receiverSocketId)
        .emit("statusReceiverSeen", { seen, conversationId });
    });

    socket.on("checkReceiverSeenCvs", async (data) => {
      const { receiverId, conversationId } = data;
      const receiverSocketId = this.userSocketMap[receiverId];
      _io.to(receiverSocketId).emit("checkReceiverSeenCvs", { conversationId });
    });

    socket.on("resultCheckSeenCvs", async (data) => {
      const { receiverId, seen, conversationId } = data;
      const receiverSocketId = this.userSocketMap[receiverId];
      _io
        .to(receiverSocketId)
        .emit("statusReceiverSeen", { seen, conversationId });
    });

    socket.on("updateInfoUser", (data) => {
      const { receiverId, updateUserId } = data;
      const receiverSocketId = this.userSocketMap[receiverId];
      _io.to(receiverSocketId).emit("receiverUpdateInfoUser", { updateUserId });
    });

    socket.on("disconnect", async () => {
      const time = new Date();
      const updateUser = { status: "offline", timeOffline: time };
      await userModel.findByIdAndUpdate(userId, updateUser);
      console.log("Client disconnected", socket.id);
      delete this.userSocketMap[userId];
      _io.emit("getOnlineUsers", Object.keys(this.userSocketMap));
    });
  };
}

module.exports = new SocketIoService();
