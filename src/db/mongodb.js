import mongoose from "mongoose";

export const initDB = async () => {
  try {
    const URI =
      "mongodb+srv://georgeif2212:EJldzR321JjOxY1u@cluster0.b9p1i7g.mongodb.net/ecommerce?retryWrites=true&w=majority";
    await mongoose.connect(URI);
    console.log("Database connected 🚀");
  } catch (error) {
    console.error("Error to connect to database", error.message);
  }
};
