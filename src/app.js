const ProductManager = require("./ProductManager.js");
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager("./Products.json");

app.get("/products", async (req, res) => {
  const { query } = req;
  const { limit } = query;
  const products = await productManager.getProducts();
  if (!limit) {
    res.json(products);
  } else {
    const limitedProducts = products.slice(0, parseInt(limit));
    res.json(limitedProducts);
  }
});

app.listen(8080, () => {
  console.log("HTTP Server listening from 8080 port");
});
