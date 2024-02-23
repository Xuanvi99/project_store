const verifyMdw = require("./user.middleware");
const uploadFileMdw = require("./uploadFile.middleware");
const codeOTPMdw = require("./codeOTP.middleware");

module.exports = { verifyMdw, uploadFileMdw, codeOTPMdw };
