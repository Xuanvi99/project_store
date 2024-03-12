const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    roomId: RoomSchema,
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    text: { type: String },
    imageIDs: [{ type: Schema.Types.ObjectId, ref: "image" }],
  },
  { timestamps: true }
);

const RoomSchema = new Schema(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "user" }],
    messages: [MessageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", MessageSchema);
module.exports = mongoose.model("room", RoomSchema);
