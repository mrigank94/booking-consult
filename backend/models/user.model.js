const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    validate: (value) => validator.isEmail(value),
  },
  userId: {
    type: String,
    require: true,
    unique: true,
    minLength: 3,
  },
  password: {
    type: String,
    require: true,
    minLength: 7,
    // validate: (password) => {
    //   if (typeof password !== "string") {
    //     return false;
    //   }

    //   const hasLowercase = /[a-z]/.test(password);
    //   const hasUppercase = /[A-Z]/.test(password);
    //   const hasNumber = /[0-9]/.test(password);
    //   const hasSpecialChar = /[!@#$%^&*(){}|<>?"]/.test(password);

    //   return hasLowercase && hasUppercase && hasNumber && hasSpecialChar;
    // },
  },
  userType: {
    type: String,
    enum: ["ADMIN", "PATIENT", "DOCTOR"],
    default: "PATIENT",
  },
  userStatus: {
    type: String,
    enum: ["PENDING", "APPROVED"],
    default: "PENDING",
  },
  contact: String,
  address: {
    type: Schema.Types.ObjectId,
    ref: "Address",
  },
});

module.exports = mongoose.model("User", userSchema);
