const express = require("express");
const path = require("path");

const productsRouter = require("./routers/products.router");

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));

app.use("/api", productsRouter);

app.listen(PORT, () => {
  console.log(`HTTP Server listening from ${PORT} port`);
});
