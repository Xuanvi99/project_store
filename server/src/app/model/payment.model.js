const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    _id: mongoose.Types.ObjectId,
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    amount: { type: Number, required: true },
    desc: { type: String, trim: true, required: false },
    paidDate: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("payment", paymentSchema);
