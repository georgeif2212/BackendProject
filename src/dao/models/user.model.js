import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const documentItemSchema = new mongoose.Schema(
  {
    name: { type: String },
    reference: { type: String },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    provider: { type: String },
    providerId: { type: String },
    role: { type: String, default: "user" },
    age: { type: Number, required: false },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
    image: { type: String },
    documents: { type: [documentItemSchema] },
    last_connection: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

userSchema.plugin(mongoosePaginate);

export default mongoose.model("User", userSchema);
