const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    roomId: RoomSchema,
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    text: { type: String },
    imageIDs: [{ type: Schema.Types.ObjectId, ref: "images" }],
  },
  { timestamps: true, versionKey: false }
);

const RoomSchema = new Schema(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "users" }],
    messages: [MessageSchema],
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("messages", MessageSchema);
module.exports = mongoose.model("rooms", RoomSchema);
