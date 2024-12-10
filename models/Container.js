const mongoose = require("mongoose");
const crypto = require("crypto");

const ContainerSchema = new mongoose.Schema(
  {
    containerID: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "Full"],
      default: "Available",
    },
    mediumOfTransport: {
      type: String,
      enum: ["Sea", "Air", "Land"],
      required: true,
    },
    location: {
      type: String
    },
    ports: [
      {
        type: String,
        required: true,
      },
    ],
    description: {
      type: String,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// add containerID with prefix "CON"
ContainerSchema.pre("save", async function (next) {
  try {
    if (!this.containerID || this.isNew) {
      const documentCount = await this.constructor.countDocuments();
      const uniqueId = crypto.randomBytes(4).toString("hex");
      this.containerID =
        "CON" + uniqueId + (documentCount + 1).toString().padStart(4, "0");
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Container", ContainerSchema);
