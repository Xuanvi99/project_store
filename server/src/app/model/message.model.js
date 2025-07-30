const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "conversation",
      required: true,
    },
    senderId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    messageType: {
      type: String,
      enum: ["text", "image", "emoji", "like"],
      required: true,
    },
    text: {
      type: String,
      default: undefined,
    },
    emojis: [
      {
        type: {
          url: { type: String, trim: true },
          alt: { type: String, trim: true },
        },
      },
    ],
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

MessageSchema.pre("save", function (next) {
  if (this.messageType !== "image") {
    this.imagesId = [];
  }
  if (this.messageType !== "emoji") {
    this.emojis = [];
  }
  if (this.messageType !== "text") {
    this.text = undefined;
  }
  next();
});

MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ receiverId: 1, senderId: 1 });
MessageSchema.index({ receiverId: 1 });

module.exports = mongoose.model("messages", MessageSchema);
