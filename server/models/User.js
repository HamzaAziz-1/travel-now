const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: [3, "Minimum length of name must be 3"],
    maxlength: [35, "Maximum length of name must be 35"],
    match: [/^[A-Za-z\s]+$/, "Enter a valid name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
    minlength:[10,"Minimum Length should be 10"],
    maxlength:[35,"Maximum Length should be 35"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: [6, "Minimum length of password is 6"],
  },
  role: {
    type: String,
    enum: ["admin", "tourist", "vendor"],
    default: "tourist",
  },
  gender: {
    type: String,
    required: [true, "Please provide gender"],
    enum: ["male", "female"],
  },
  phoneNo: {
    type: String,
    required: [true, "Please provide phone number"],
    validate: {
      validator: validator.isMobilePhone,
      message: "Please provide valid phone number",
    },
  },
  country: {
    type: String,
    required: [true, "Please provide country"],
  },
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  verified: Date,
  passwordToken: {
    type: String,
  },
  passwordTokenExpirationDate: {
    type: Date,
  },
  image: {
    type: String,
    default:
      "https://res.cloudinary.com/dlpjcvsii/image/upload/v1688459756/file-upload/tmp-1-1688459755587_hvt1fy.png",
  },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
