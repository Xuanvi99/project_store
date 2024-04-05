const { userModel, codeOTPModel } = require("../model");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
class codeOTP {
  create = async (req, res, next) => {
    const email = req.body.email;
    try {
      if (!email)
        return res.status(403).json({ message: "email not is valid " });
      const user = await userModel.findOne({ email: email }).lean();
      const OTP = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      req.user = user || { email: email };
      req.OTP = OTP;
      return next();
    } catch (error) {
      res.status(403).json({ errMessage: "Create Otp error" });
    }
  };

  encode = async (req, res, next) => {
    const { OTP } = req;
    try {
      bcrypt.genSalt(+process.env.saltRounds, async function (err, salt) {
        if (err) throw new Error({ error: err });
        bcrypt.hash(OTP, salt, async function (_, hash) {
          req.codeOTP = hash;
          return next();
        });
      });
    } catch (error) {
      res.status(403).json({ errMessage: "Encode Otp error" });
    }
  };

  verify = async (req, res, next) => {
    const { email, code } = req.body;
    try {
      if (!email || !code) {
        return res.status(403).json({ errMessage: "Yêu cầu không hợp lệ!" });
      }
      const isValidCOdeOTP = await codeOTPModel
        .findOne({ email: email, code: code })
        .lean();
      if (isValidCOdeOTP?.status)
        res.status(420).json({ errMessage: "Mail này đã được sử dụng!" });
      const isExpired = isValidCOdeOTP ? false : true;
      req.code = code;
      req.email = email;
      req.isExpired = isExpired;
      return next();
    } catch (error) {
      res.status(403).json({ errMessage: "Verify email fail" });
    }
  };
}

module.exports = new codeOTP();
