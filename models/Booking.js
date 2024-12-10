const mongoose = require("mongoose");
const crypto = require("crypto");

const senderInfoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);
const receiverInfoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);
const BookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
    },
    sender: {
      type: senderInfoSchema,
      required: true,
    },
    receiver: {
      type: receiverInfoSchema,
      required: true,
    },
    supplierStatus: {
      type: String,
      enum: ["clientself", "supplierself", "pending"],
      default: "pending",
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    type: {
      type: String,
      enum: ["bundled", "single"],
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    status: {
      type: String,
      enum: [
        "processing",
        "pending",
        "accepted",
        "cancelled",
        "delivered",
        "CWA",
        "BWA",
      ],
      default: "processing",
    },
    qrCode: {
      type: String,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    location: {
      type: String,
      required: true,
    },
    container: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Container",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// generate booking id with prefix "B"
BookingSchema.pre("save", async function (next) {
  try {
    if (!this.bookingId || this.isNew) {
      const documentCount = await this.constructor.countDocuments();
      const uniqueId = crypto.randomBytes(4).toString("hex");
      this.bookingId = `B${uniqueId}${
        documentCount + 1
      }.tostring().padStart(4, "0")`;
    }
    next();
  } catch (error) {
    next(error);
  }
});
module.exports = mongoose.model("Booking", BookingSchema);
