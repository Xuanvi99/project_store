const { userModel, conversationModel } = require("../model/index");
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
