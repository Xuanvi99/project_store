const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
  _userId: {
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

refreshTokenSchema.statics.saveToken = async function (user, refreshToken) {
  const _object = new this({
    _userId: user,
    token: refreshToken,
  });
  await _object.save();
  return _object;
};

refreshTokenSchema.statics.deleteToken = async function (refreshToken) {
  const idRfToken = await this.findOneAndDelete({ token: refreshToken }).exec();
  return idRfToken;
};
module.exports = mongoose.model("refreshTokens", refreshTokenSchema);
