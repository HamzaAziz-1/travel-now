const mongoose = require("mongoose");

const connectDB = (url) => {
  mongoose.set("strictQuery", false);
  return mongoose
    .connect(url)
    .then(console.log("DB Connected sucessfully..."))
    .catch((error)=>console.log("Error Connecting to DB "+error));
};

module.exports = connectDB;
