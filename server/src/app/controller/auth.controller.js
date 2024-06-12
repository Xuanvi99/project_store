const { userModel, tokenModel, cartModel } = require("../model");

const jwt = require("jsonwebtoken");
const codeOTPModel = require("../model/codeOTP.model");
class authController {
  register = async function (req, res) {
    try {
      const { phone, password } = req.body;
      const newUser = new userModel({ phone, password });
      const result = await newUser.save();
      const newCart = new cartModel({
        userId: result._id,
      });
      await newCart.save();
      const accessToken = newUser.generateAccessToken();
      const refreshToken = newUser.generateRefreshToken();
      await tokenModel.saveToken(newUser, refreshToken);
      const { password: password1, __v, ...others } = newUser._doc;
      res
        .status(201)
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({
          user: others,
          accessToken,
        });
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };

  loginAuth = async function (req, res) {
    const { phoneOrEmail, password } = req.body;
    try {
      const user = await userModel.findOneUser(phoneOrEmail, password);
      if (!user)
        return res
          .status(403)
          .json({ errMessage: "Tài khoản hoặc mật khẩu không đúng!" });
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
      await tokenModel.saveToken(user, refreshToken);
      const { password: pw, __v, ...others } = user._doc;

      return res
        .status(200)
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({
          user: others,
          accessToken,
        });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  loginOauthGoogle = async function (req, res) {
    try {
      const user = req.user;
      const { password, _v, createdAt, updatedAt, ...others } = user._doc;
      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();
      await tokenModel.saveToken(user._doc, refreshToken);
      return res
        .status(200)
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({
          user: others,
          accessToken,
        });
    } catch (error) {
      res.status(500).json({ errMessage: "error auth google" });
    }
  };

  updatePassword = async (req, res) => {
    const { phoneOrEmail, code, password } = req.body;
    try {
      const user = await userModel
        .findOne({ $or: [{ phone: phoneOrEmail }, { email: phoneOrEmail }] })
        .exec();
      user.password = password;
      await user.save();
      if (code) {
        await codeOTPModel
          .findOneAndUpdate({ email: phoneOrEmail, code }, { status: true })
          .exec();
      }
      res.status(200).json({ message: "update password success" });
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };

  logOut = async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        await tokenModel.deleteToken(refreshToken);
      }
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "Logged out successfully!" });
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };

  refreshToken = async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken)
        return res
          .status(400)
          .clearCookie("refreshToken")
          .json({ errMessage: "Invalid refreshToken" });
      const checkRfToken = await tokenModel
        .findOne({
          token: refreshToken,
        })
        .exec();
      if (!checkRfToken)
        return res
          .status(400)
          .clearCookie("refreshToken")
          .json({ errMessage: "token does not exist!" });
      jwt.verify(
        refreshToken,
        process.env.RF_PRIVATE_KEY,
        async (err, decode) => {
          if (err || !decode)
            return res.status(401).json({ errMessage: "refreshToken expired" });
          const user = await userModel
            .findById({ _id: decode.userID }, { password: 0, __v: 0 })
            .populate("avatar")
            .exec();
          if (!user)
            return res
              .status(401)
              .json({ errMessage: "refreshToken is not valid" });
          const newAccessToken = user.generateAccessToken();
          const newRefreshToken = user.generateRefreshToken();
          await tokenModel.saveToken(user, newRefreshToken);
          await tokenModel.deleteToken(refreshToken);
          return res
            .status(201)
            .cookie("refreshToken", newRefreshToken, {
              httpOnly: true,
              secure: false,
              sameSite: "strict",
              maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .json({ user: user._doc, accessToken: newAccessToken });
        }
      );
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };
}

module.exports = new authController();
