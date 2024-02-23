const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    userName: {
      type: String,
      default: "user" + Math.floor(Math.random() * 100000),
    },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    password: { type: String, default: "" },
    date: { type: String, default: "" },
    address: { type: String, default: "" },
    avatar: { type: String, default: "http://localhost:3000/imageDefault.png" },
    cartId: { type: Schema.Types.ObjectId, ref: "cart", default: "" },
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
  bcrypt.genSalt(+process.env.saltRounds, function (err, salt) {
    if (err) return next(err);
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
  console.log("this");
  const accessToken = jwt.sign(
    { userID: this._id, role: this.role, type: "access_token" },
    process.env.AC_PRIVATE_KEY,
    { expiresIn: "10m" }
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
