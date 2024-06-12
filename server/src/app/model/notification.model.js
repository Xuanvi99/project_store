const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    listNotify: [
      {
        orderId: { type: Schema.Types.ObjectId, ref: "orders" },
        text: { type: String, require: true },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("notifications", NotificationSchema);
