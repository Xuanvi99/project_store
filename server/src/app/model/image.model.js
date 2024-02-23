const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  imageId: { type: String, required: true },
  url: { type: String, required: true },
});

module.exports = mongoose.model("image", ImageSchema);
