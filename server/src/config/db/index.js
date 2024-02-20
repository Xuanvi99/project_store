const mongoose = require("mongoose");

const connectMDB = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/XVstore`);
    console.log("Connected !!!");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connectMDB };
