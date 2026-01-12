const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    orderId: String,
    products: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    amount: Number,
    email: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "completed", "failed", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["momo", "stripe", "cod", "cash"],
      default: "cod",
    },
    paymentId: String, // MoMo transaction ID or payment ID
    paymentTime: Date, // Payment completion time
  },
  { timestamps: true }
);
const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
