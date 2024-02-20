const userModel = require("../model/user.model");
const codeOTPModel = require("../model/codeOTP.model");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
class codeOTP {
  create = async (req, res, next) => {
    const email = req.body.email;
    try {
      if (!email)
        return res.status(403).json({ message: "email not is valid " });
      const user = await userModel.findOne({ email: email }).lean();
      if (user) {
        const OTP = otpGenerator.generate(6, {
          digits: true,
          upperCaseAlphabets: false,
          specialChars: false,
          lowerCaseAlphabets: false,
        });
        bcrypt.genSalt(+process.env.saltRounds, async function (err, salt) {
          if (err) throw new Error({ error: err });
          bcrypt.hash(OTP, salt, async function (_, hash) {
            req.codeOTP = hash;
            req.user = user;
            next();
          });
        });
      } else {
        return res.status(404).json({ message: "email not found!" });
      }
    } catch (error) {
      console.log("error: ", error);
      res.status(403).json({ errMessage: error });
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
      req.isExpired = isExpired;
      next();
    } catch (error) {
      res.status(403).json({ errMessage: error });
    }
  };
}

module.exports = new codeOTP();
