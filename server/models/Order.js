const mongoose = require("mongoose");

const SingleOrderItemSchema = mongoose.Schema({
  vendor: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  duration: { type: Number, required: true },
  availableDays: { type: [String], required: true },
  timeSlots: {
    type: [
      {
        start: { type: String, required: true },
        end: { type: String, required: true },
      },
    ],
    required: true,
  },
  date: {
    type: String,
    required: [true, "Please select the date for tour"],
  },
  amount: { type: Number, required: true },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
    required: true,
  },
  endTime: {
    type: String,
  },
});

const OrderSchema = mongoose.Schema(
  {
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: [SingleOrderItemSchema],
    status: {
      type: String,
      enum: ["pending", "paid", "completed", "canceled"],
      default: "pending",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
