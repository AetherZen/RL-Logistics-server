const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  bookingID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["unpaid", "paid", "failed", "cancelled"],
    default: "unpaid",
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "cod", "online"],
  },
  transactionID: {
    type: String,
  },
  paymentDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// add a method which will update the paymentDate when the status will be paid
// NOTE: while updating the status we have to use save() method
PaymentSchema.pre("save", function (next) {
  if (this.status === "paid") {
    this.paymentDate = Date.now();
  }
  next();
});

module.exports = mongoose.model("Payment", PaymentSchema);
