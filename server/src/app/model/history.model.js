const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users" },
});

module.exports = mongoose.model("histories", HistorySchema);
