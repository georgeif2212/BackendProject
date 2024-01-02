import mongoose, { Schema } from "mongoose";

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
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
