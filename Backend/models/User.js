const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,

  resetOTP: String,
  otpExpiry: Date,
});

module.exports = mongoose.model("User", userSchema);
