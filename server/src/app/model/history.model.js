const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "user" },
});

module.exports = mongoose.model("history", HistorySchema);
