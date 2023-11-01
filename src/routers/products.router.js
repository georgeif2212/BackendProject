import ProductManager from "../ProductManager.js";
import path from "path";
import { __dirname } from "../utils.js";
import { Router } from "express";

const router = Router();
// * Ruta con path porque sin ella no me daba
const productManager = new ProductManager(
  path.join(__dirname, "../Products.json")
);

console.log(__dirname);
router.get("/products", async (req, res) => {
  const { query } = req;
  const { limit } = query;
  const products = await productManager.getProducts();
  if (!limit) {
    res.status(200).json(products);
  } else {
    const limitedProducts = products.slice(0, parseInt(limit));
    res.status(200).json(limitedProducts);
  }
});

router.post("/products", async (req, res) => {
  try {
    const { body } = req;
    // * Añadí la función productExists para verificar si existe el producto y mandar un error
    const productExists = await productManager.productExists(body.code);

    if (productExists) {
      return res
        .status(400)
        .json({ error: "Product with the same code already exists." });
    }

    const newProduct = await productManager.addProduct(body);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  const products = await productManager.getProducts();
  const product = products.find((product) => {
    return product.id == productId;
  });

  if (!product) {
    res
      .status(404)
      .json({ error: `Usuario con id ${productId} no encontrado.` });
  } else {
    res.json(product);
  }
});

router.put("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  const { body } = req;
  const message = await productManager.updateProduct(productId, body);
  res.status(200).json(message);
});

router.delete("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  const message = await productManager.deleteProductById(productId);
  res.status(200).json(message);
});

export default router;
