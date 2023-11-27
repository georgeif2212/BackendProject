import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const CartSchema = new mongoose.Schema(
  {
    products: { type: Array, required: true },
  },
  { timestamps: true }
);

CartSchema.plugin(mongoosePaginate);

export default mongoose.model("Cart", CartSchema);
