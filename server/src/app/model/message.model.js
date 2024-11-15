const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    roomChatId: {
      type: Schema.Types.ObjectId,
      ref: "roomchats",
      require: true,
    },
    senderId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    messageType: {
      type: String,
      enum: ["text", "image"],
      require: true,
    },
    text: {
      type: String,
      default: "",
    },
    imageIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "images",
      },
    ],
    seen: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("messages", MessageSchema);
