const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomChatSchema = new Schema(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "users" }],
    totalMessage: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("roomChats", RoomChatSchema);
