const cloudinaryV2 = require("cloudinary").v2;
const streamifier = require("streamifier");
const { imageModel } = require("../app/model");

class cloudinary {
  createFile = (file, folder) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinaryV2.uploader.upload_stream(
        {
          folder: folder,
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

  uploadOneFile = async function (file, folder) {
    const imageCloud = await this.createFile(file, folder);
    return imageCloud;
  };

  uploadFile = async function (file, folder) {
    let arrId = [];
    for (let i = 0; i < file.length; i++) {
      const imageCloud = await this.createFile(file[i], folder);
      const newImage = new imageModel({
        public_id: imageCloud.public_id,
        url: imageCloud.url,
        folder: folder,
      });
      const result = await newImage.save();
      arrId.push(result._id);
    }
    return arrId;
  };
}

module.exports = new cloudinary();
