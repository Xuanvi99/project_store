const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "user" },
    product_id: { type: Schema.Types.ObjectId, ref: "product" },
    text: { type: String, default: "" },
    star: { type: Number },
    like: { type: Number, default: 0 },
    reply: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("comment", commentSchema);
