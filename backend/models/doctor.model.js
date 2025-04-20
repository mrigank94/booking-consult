const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  fees: { type: Number, require: true, min: 1 },
  specialization: String,
  experience: { type: Number, min: 0, require: true },
  availability: [
    {
      day: {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Firday",
          "Saturday",
          "Sunday",
        ],
      },
      timeSlots: [
        {
          type: String,
          required: true,
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Doctor", doctorSchema);
