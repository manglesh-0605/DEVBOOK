//the installed mongoose package to connect to cloud mongoDB -
const mongoose = require('mongoose');

//the config package that we installed to the global varianbels-
const config = require('config');

//ti get the mongoDB connect string from config/default.json file-
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);

    //exit process with failure--
    process.exit(1);
  }
};

module.exports = connectDB;
