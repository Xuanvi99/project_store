const multer = require("multer");

const uploadFile = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
});

module.exports = uploadFile;
