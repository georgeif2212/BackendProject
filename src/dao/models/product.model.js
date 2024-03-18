import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const photoProductSchema = new mongoose.Schema(
  {
    name: { type: String },
    reference: { type: String },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    photos: { type: [photoProductSchema] },
    code: { type: String, required: true, unique: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: "65a1936875ec102080026e04",
    },
  },
  { timestamps: true }
);

ProductSchema.pre("find", function () {
  this.populate("owner");
});

ProductSchema.plugin(mongoosePaginate);

export default mongoose.model("Product", ProductSchema);
