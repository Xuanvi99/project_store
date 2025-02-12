const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "conversation",
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
    imagesId: [
      {
        type: Schema.Types.ObjectId,
        ref: "images",
      },
    ],
    receiverSeen: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("messages", MessageSchema);
