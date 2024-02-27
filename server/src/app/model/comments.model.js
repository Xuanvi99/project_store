const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    productId: { type: Schema.Types.ObjectId, ref: "product" },
    listImage: [{ type: Schema.Types.ObjectId, ref: "image" }],
    text: { type: String, default: "" },
    star: { type: Number },
    like: { type: Number, default: 0 },
    reply: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("comment", CommentSchema);
