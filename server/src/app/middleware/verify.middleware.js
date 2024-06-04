const jwt = require("jsonwebtoken");
const { userModel, cartModel } = require("../model");
const bcrypt = require("bcrypt");

class verify {
  verifyToken = async function (req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(401).json({ ErrorMessage: "Token is required!" });
      }
      jwt.verify(
        token,
        process.env.AC_PRIVATE_KEY,
        async function (err, decode) {
          if (err || !decode) {
            return res.status(401).json({ ErrorMessage: "Token expired" });
          }
          const user = await userModel.findById(decode.userID);
          if (!user) {
            return res
              .status(401)
              .json({ ErrorMessage: "Authentication failed. User not found." });
          }
          req.user = user;
          next();
        }
      );
    } catch (error) {
      return res.status(500).json({ ErrorMessage: "verify token error" });
    }
  };

  verifyRole = function (req, res, next) {
    const user = req.user;
    if (user.role === "admin") {
      next();
    } else {
      res.status(403).json({ ErrorMessage: "User not allowed" });
    }
  };

  verifyLoginGoogle = async function (req, res, next) {
    const { name: userName, email, email_verified } = req.body;
    if (!email_verified) {
      return res.status(403).json({
        errorMessage: "Google email not verified",
      });
    }
    try {
      const user = await userModel
        .findOne({ email: email })
        .populate("avatar")
        .exec();
      if (!user) {
        const newUser = new userModel({
          userName: userName,
          email,
          password: "XVStore",
          modifiedPassword: false,
        });
        const result = await newUser.save();
        req.user = result;
        const newCart = new cartModel({
          userId: result._id,
        });
        await newCart.save();
      } else {
        req.user = user;
      }
      return next();
    } catch (error) {
      res.status(500).json({ errMessage: "server error1" });
    }
  };

  verifyCheckPassword = async function (req, res, next) {
    const id = req.params.id;
    const password = req.body.password;
    try {
      const user = await userModel.findById(id).exec();
      if (!user) {
        return res.status(404).json({ errMessage: "User not found!" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return res
          .status(400)
          .json({ errMessage: "Matches the current password", isMatch: true });
      }
      return next();
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };
}

module.exports = new verify();
