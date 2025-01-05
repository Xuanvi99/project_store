const { userModel, roomChatModel } = require("../model/index");
class SocketIoService {
  connect = async (socket) => {
    const id = socket.handshake.auth.id;

    console.log("Client connected " + socket.id);

    const user = await userModel.findById(id);
    const admin = await userModel.findOne({ role: "admin" }).lean();

    let roomChat = "";
    if (id && user && user.role === "buyer") {
      roomChat = await roomChatModel
        .findOne({
          participants: { $in: [user._id] },
        })
        .lean();

      if (!roomChat) {
        const admin = await userModel.findOne({ role: "admin" }).lean();
        const newRoom = new roomChatModel({
          participants: [user._id, admin._id],
        });
        roomChat = await newRoom.save();
      }
    }

    if (id === admin._id.toString()) socket.join(admin._id.toString());

    const listRoomChat = await roomChatModel
      .find({ totalMessage: { $gte: 0 } })
      .sort({ updateAt: -1 })
      .populate({ path: "participants" });
    _io.to(admin._id.toString()).emit("listRoomChat", listRoomChat);

    socket.on("user_online", (data) => console.log(data));

    socket.emit("getListUser", () => {});

    socket.on("send_message", (data) => {
      console.log("data: ", data);
    });

    socket.on("disconnect", async () => {
      const time = new Date();
      const updateUser = { status: "offline", timeOffline: time };
      const result = await userModel.findByIdAndUpdate(id, updateUser);
      if (result) {
        const listRoomChat = await roomChatModel
          .find({ totalMessage: { $gte: 0 } })
          .sort({ updateAt: -1 })
          .populate({ path: "participants" });
        _io.to(admin._id.toString()).emit("listRoomChat", listRoomChat);
      }
      console.log("Client disconnected");
    });
  };
}

module.exports = new SocketIoService();
