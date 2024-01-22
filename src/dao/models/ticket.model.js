import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const TicketSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true },
  },
  { timestamps: true }
);

TicketSchema.plugin(mongoosePaginate);

export default mongoose.model("Ticket", TicketSchema);
