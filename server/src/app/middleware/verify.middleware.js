const jwt = require("jsonwebtoken");
const { userModel, cartModel } = require("../model");

class verifyMiddleware {
  verifyToken = async function (req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token)
        return res.status(401).json({ ErrorMessage: "Token is required!" });
      const decode = jwt.verify(token, process.env.AC_PRIVATE_KEY);
      const user = await userModel.findById(decode.userID);
      if (!user)
        return res.status(401).json({ ErrorMessage: "Token is not valid" });
      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({ ErrorMessage: "verify token error" });
    }
  };

  verifyRole = function (req, res, next) {
    const user = req.user;
    if (user.role === "buyer") {
      next();
    } else {
      res.status(403).json({ ErrorMessage: "User not allowed" });
    }
  };

  verifyLoginGoogle = async function (req, res, next) {
    const { name: userName, email, email_verified } = req.body;
    try {
      if (!email_verified) {
        return res.status(403).json({
          errorMessage: "Google email not verified",
        });
      }
      const user = await userModel.findOne({ email: email }).exec();
      if (!user) {
        const newUser = new userModel({
          userName,
          email,
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
      next();
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };
}

module.exports = new verifyMiddleware();
