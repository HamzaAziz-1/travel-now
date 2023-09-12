const mongoose = require("mongoose");

const connectDB = (url) => {
  mongoose.set("strictQuery", false);
  return mongoose
    .connect(url)
    .then(console.log("DB Connected"))
    .catch("Error Connecting to DB");
};

module.exports = connectDB;
