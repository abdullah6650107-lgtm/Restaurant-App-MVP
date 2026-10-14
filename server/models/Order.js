const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0.01,
    },
    lineTotal: {
      type: Number,
      required: true,
      min: 0.01,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "Order must contain at least one item.",
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0.01,
    },
    total: {
      type: Number,
      required: true,
      min: 0.01,
    },
    deliveryFee: { type: Number, required: true, min: 0, default: 0 },
    customerName: { type: String, trim: true, maxlength: 100, default: "" },
    address: { type: String, trim: true, maxlength: 500, default: "" },
    paymentMethod: { type: String, trim: true, default: "Cash on Delivery" },
    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "served", "cancelled"],
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

module.exports = mongoose.model("Order", orderSchema);
