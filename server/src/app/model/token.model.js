const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "7d",
  },
});

TokenSchema.statics.saveToken = async function (user, refreshToken) {
  const _object = new this({
    userId: user,
    token: refreshToken,
  });
  await _object.save();
  return _object;
};

TokenSchema.statics.deleteToken = async function (refreshToken) {
  const idRfToken = await this.findOneAndDelete({ token: refreshToken }).exec();
  return idRfToken;
};
module.exports = mongoose.model("tokens", TokenSchema);
