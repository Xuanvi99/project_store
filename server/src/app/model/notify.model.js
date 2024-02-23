const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotifySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    listNotify: [
      {
        orderId: { type: Schema.Types.ObjectId, ref: "order" },
        text: { type: String, require: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("notification", NotifySchema);
