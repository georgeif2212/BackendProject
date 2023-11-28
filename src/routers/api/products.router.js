// import ProductManager from "../dao/ProductManagerFS.js"; // ! FS Product manager
import ProductsManager from "../../dao/Products.manager.js";
import { __dirname } from "../../utils.js";
import { Router } from "express";
import { buildResponsePaginated } from "../../utils.js";

const router = Router();
// * Ruta con path porque sin ella no me daba
// const productManager = new ProductManager(
//   path.join(__dirname, "../Products.json")
// );

// ! ENDPOINTS FOR PRODUCTS
router.get("/products", async (req, res) => {
  const { limit = 10, page = 1, sort, search } = req.query;

  const criteria = {};
  const options = { limit, page };
  if (sort) {
    options.sort = { price: sort };
  }
  if (search) {
    criteria.category = search;
  }

  const result = await ProductsManager.get(criteria, options);
  res.status(200).json(buildResponsePaginated({ ...result, sort, search }));
});

router.post("/products", async (req, res) => {
  try {
    // * Try catch para ver si el producto con el mismo code existe
    const { body } = req;
    const existingProduct = await ProductsManager.alreadyExists(body.code);

    if (existingProduct) {
      return res
        .status(400)
        .json({ error: "Product with the same code already exists" });
    }

    // * Try catch para ver si el producto cumple con todos los campos requeridos
    try {
      const product = await ProductsManager.create(body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await ProductsManager.getById(productId);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  const { body } = req;
  try {
    await ProductsManager.updateById(productId, body);
    res.status(200).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    await ProductsManager.deleteById(productId);
    res.status(200).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
