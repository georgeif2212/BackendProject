import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const MesageSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

MesageSchema.plugin(mongoosePaginate);

export default mongoose.model("Message", MesageSchema);
