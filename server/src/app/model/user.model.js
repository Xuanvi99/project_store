const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    userName: {
      type: String,
      default: "user" + Math.floor(Math.random() * 100000),
      max: [16, "max length 16"],
    },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    password: { type: String, default: "" },
    date: { type: String, default: new Date().toISOString().split("T")[0] },
    gender: { type: String, default: "other" },
    address: { type: String, default: "" },
    avatar: {
      type: Schema.Types.ObjectId,
      ref: "image",
    },
    avatarDefault: {
      type: String,
      default:
        "https://res.cloudinary.com/damahknfx/image/upload/v1709063132/avatar/quz06h6htrcrlrm5furt.png",
    },
    blocked: { type: Boolean, default: false },
    role: { type: String, enum: ["admin", "buyer"], default: "buyer" },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  const user = this;
  if (user.password === "") {
    user.password = Math.floor(Math.random() * 1000000).toString();
  }
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(+process.env.saltRounds, function (_, salt) {
    bcrypt.hash(user.password, salt, function (err, hash) {
      user.password = hash;
      return next();
    });
  });
});

UserSchema.statics.findOneUser = async function (phoneOrEmail, password) {
  try {
    const user = await this.findOne({
      $or: [{ phone: phoneOrEmail }, { email: phoneOrEmail }],
    }).exec();
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }
    return user;
  } catch (error) {
    console.log(error);
  }
};

UserSchema.methods.generateAccessToken = function () {
  const accessToken = jwt.sign(
    { userID: this._id, role: this.role, type: "access_token" },
    process.env.AC_PRIVATE_KEY,
    { expiresIn: "30m" }
  );

  return accessToken;
};

UserSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    { userID: this._id, role: this.role, type: "refresh_token" },
    process.env.RF_PRIVATE_KEY,
    { expiresIn: "7d" }
  );

  return refreshToken;
};

module.exports = mongoose.model("user", UserSchema);
