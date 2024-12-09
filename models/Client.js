const mongoose = require("mongoose");

// FormSchema
const FormSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      trim: true,
      required: true,
    },
    formLink: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    _id: false,
    versionKey: false,
  }
);

// ClientSchema

/**
 * userId for customer will be auto generated and will have prefix "C"
 * userId for supplier will be auto generated and will have prefix "S"
 */

const ClientSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please provide name"],
      maxlength: 50,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Please provide phone number"],
      trim: true,
      unique: true,
    },
    address: {
      type: String,
      trim: true,
      default: " ",
    },
    role: {
      type: String,
      enum: ["customer", "supplier"],
      default: "customer",
    },
    otp: {
      type: String,
    },
    otp_expiry: {
      // otp will expire after 4 minutes
      type: Date,
    },
    formLink: {
      type: [FormSchema],
    },
  },
  { timestamps: true, versionKey: false }
);

// middleware to generate unique id before saving client
ClientSchema.pre("save", async function (next) {
  let count = await Client.countDocuments();
  count = count + 1;
  this.userId =
    (this.role === "supplier" ? "S" : "C") + count.toString().padStart(4, "0");
  next();
});

module.exports = mongoose.model("Client", ClientSchema);
