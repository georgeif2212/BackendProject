import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, default: 1, min: 1 },
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    products: { type: [productItemSchema], default: [] },
  },
  { timestamps: true }
);

CartSchema.pre("find", function () {
  this.populate("products.product");
});

CartSchema.plugin(mongoosePaginate);

export default mongoose.model("Cart", CartSchema);
