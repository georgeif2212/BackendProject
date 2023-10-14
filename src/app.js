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

app.get("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  const products = await productManager.getProducts();
  const product = products.find((product) => {
    return product.id === parseInt(productId);
  });

  if (!product) {
    res.json({ error: `Usuario con id ${productId} no encontrado.`})
  } else {
    res.json(product);
  }
});

app.listen(8080, () => {
  console.log("HTTP Server listening from 8080 port");
});
