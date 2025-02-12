const multer = require("multer");

const uploadFile = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25000000,
    // files: 10,
  },
});

module.exports = uploadFile;
