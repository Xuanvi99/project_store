const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CodeOTPSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "1h",
  },
});

CodeOTPSchema.statics.saveCodeOTP = async function (email, codeOTP) {
  const _object = new this({
    email: email,
    code: codeOTP,
    status: false,
  });
  await _object.save();
  return _object;
};

module.exports = mongoose.model("codeOTPs", CodeOTPSchema);
