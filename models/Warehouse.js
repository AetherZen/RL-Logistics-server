const mongoose = require("mongoose");
const crypto = require("crypto");

const WarehouseSchema = new mongoose.Schema(
  {
    warehouseId: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      enum: ["CWA", "BWA"],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// generate wirehouse id with prefix "W"
WarehouseSchema.pre("save", async function (next) {
  try {
    if (!this.warehouseId || this.isNew) {
      const documentCount = await this.constructor.countDocuments();
      const uniqueId = crypto.randomBytes(3).toString("hex");
      this.warehouseId = `W${uniqueId}${(documentCount + 1)
        .toString()
        .padStart(4, "0")}`;
    }
  } catch (error) {
    return next(error);
  }
  next();
});

module.exports = mongoose.model("Warehouse", WarehouseSchema);
