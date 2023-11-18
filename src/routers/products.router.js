// import ProductManager from "../dao/ProductManagerFS.js"; // ! FS Product manager
import ProductsManager from "../dao/Products.manager.js";
import path from "path";
import { __dirname } from "../utils.js";
import { Router } from "express";
import { emit } from "../socket.js";

const router = Router();
// * Ruta con path porque sin ella no me daba
// const productManager = new ProductManager(
//   path.join(__dirname, "../Products.json")
// );

// ! ENDPOINTS FOR PRODUCTS
router.get("/products", async (req, res) => {
  const { query } = req;
  const { limit } = query;

  if (!limit) {
    const products = await ProductsManager.get();
    res.status(200).json(products);
  } else {
    const products = await ProductsManager.get(parseInt(limit));
    res.status(200).json(products);
  }
});

router.post("/products", async (req, res) => {
  try {
    const { body } = req;
    const existingProduct = await ProductsManager.alreadyExists(body.code);
    if (existingProduct)
      return res
        .status(400)
        .json({ error: "Product with the same code already exists" });

    const product = await ProductsManager.create(body);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/products/:productId", async (req, res) => {
  const { productId } = req.params;
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
