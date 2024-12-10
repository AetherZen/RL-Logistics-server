const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    details:{
      type: String,
      required: true,
    },
    deliveryAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
