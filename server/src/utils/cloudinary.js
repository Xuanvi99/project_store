const cloudinaryV2 = require("cloudinary").v2;
const streamifier = require("streamifier");

class cloudinary {
  uploadOneFile = (file) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinaryV2.uploader.upload_stream(
        {
          folder: "avatar",
          resource_type: "image",
        },
        (error, result) => {
          console.log("result: ", result);
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  };

  deleteFile = (publicId) => {
    return new Promise((resolve, reject) => {
      cloudinaryV2.uploader.destroy(
        publicId,
        {
          resource_type: "image",
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
    });
  };
}

module.exports = new cloudinary();
