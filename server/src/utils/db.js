const mongoose = require("mongoose");

const connectMDB = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/XVstore`);
    console.log("DB Connected !!!");
  } catch (error) {
    console.log("error db");
  }
};

module.exports = { connectMDB };
