import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { __dirname } from "./utils.js";

import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";


const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));

app.use("/api", productsRouter, cartsRouter);

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT} 🤩`);
});
