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
      enum: ["text", "image", "emojis", "like"],
      require: true,
    },
    text: {
      type: String,
      default: undefined,
    },
    emojis: {
      type: {
        url: { type: String, trim: true },
        alt: { type: String, trim: true },
      },
      default: undefined,
    },
    imagesId: [
      {
        type: Schema.Types.ObjectId,
        ref: "images",
        default: undefined,
      },
    ],
    receiverSeen: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("messages", MessageSchema);
