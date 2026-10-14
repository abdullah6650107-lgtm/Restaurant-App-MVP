const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    reservationDate: {
      type: Date,
      required: true,
    },
    partySize: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    notes: {
      type: String,
      default: "",
      trim: true,
      maxlength: 250,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
