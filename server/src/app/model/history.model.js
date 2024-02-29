const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HistorySchema = new Schema({});

module.exports = mongoose.model("history", HistorySchema);
