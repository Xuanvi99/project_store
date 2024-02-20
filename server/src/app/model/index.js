const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const Schema = mongoose.Schema;
mongoose.plugin(slug);

const Test = new Schema({
  title: { type: String, require },
  slug: { type: String, slug: "title", unique: true },
});

module.exports = mongoose.model("Test", Test);
