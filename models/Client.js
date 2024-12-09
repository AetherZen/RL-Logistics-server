const mongoose = require("mongoose");

// FormSchema
const FormSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      trim: true,
      required: [true, "Booking ID is required"],
      validate: {
        validator: function(v) {
          return v != null && v.length > 0;
        },
        message: props => `${props.value} is not a valid Booking ID`
      }
    },
    link: {
      type: String,
      trim: true,
      required: [true, "Link is required"],
      validate: {
        validator: function(v) {
          return v != null && v.length > 0;
        },
        message: props => `${props.value} is not a valid link`
      }
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
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email",
      ],
      unique: true,
    },
    phone: {
      type: String,
      required: true,
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
    otp: String,
    otp_expiry: Date, // otp will expire after 4 minutes
    formLink: [FormSchema],
  },
  { timestamps: true, versionKey: false }
);

// middleware to generate unique id before saving client
// Improved middleware
ClientSchema.pre("save", async function (next) {
    if (!this.userId) {
      try {
        const count = await this.constructor.countDocuments();
        this.userId =
          (this.role === "supplier" ? "S" : "C") + (count + 1).toString().padStart(4, "0");
      } catch (error) {
        return next(error);
      }
    }
    next();
  });

module.exports = mongoose.model("Client", ClientSchema);
