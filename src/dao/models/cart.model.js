import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    products: { type: Array, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", CartSchema);
