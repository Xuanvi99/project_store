class SocketIoService {
  connect = async (socket) => {
    console.log("Client connected " + socket.id);

    socket.on("user_online", (data) => console.log(data));

    socket.on("send_message", (data) => {
      console.log("data: ", data);
      _io.to(roomChatId).emit("send_message", data);
    });

    socket.on("number_message_seen", (data) => console.log(data));

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  };
}

module.exports = new SocketIoService();
