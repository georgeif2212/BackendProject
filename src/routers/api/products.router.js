// import ProductManager from "../dao/ProductManagerFS.js"; // ! FS Product manager
import ProductsController from "../../controllers/products.controller.js";
import { Router } from "express";
import {
  buildResponsePaginatedProducts,
  __dirname,
  buildResponseUpdate,
  buildResponseDelete,
} from "../../utils/utils.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { uploaderMiddleware } from "../../utils/uploader.js";

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

  const result = await ProductsController.get(criteria, options);
  res.status(200).json(buildResponsePaginated({ ...result, sort, search }));
});

router.post(
  "/products",
  authMiddleware("jwt"),
  uploaderMiddleware("product").array("photos"),
  async (req, res, next) => {
    const { body } = req;
    const existingProduct = await ProductsController.alreadyExists(body.code);
    if (existingProduct) {
      return res
        .status(400)
        .json({ error: "Product with the same code already exists" });
    }

    // * Try catch para ver si el producto cumple con todos los campos requeridos
    try {
      body.owner = req.user._id;
      console.log();
      const product = await ProductsController.create({
        body,
        files: req.files,
      });
      req.logger.debug("Product created", product);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/products/:productId", async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await ProductsController.getById(productId);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

router.put("/products/:productId", async (req, res, next) => {
  const { productId } = req.params;
  const { body } = req;
  try {
    await ProductsController.updateById(productId, body);
    req.logger.debug("Producto actualizado");
    res.status(200).json(buildResponseUpdate());
  } catch (error) {
    req.logger.error("Error updating");
    next(error);
  }
});

router.delete(
  "/products/:productId",
  authMiddleware("jwt"),
  async (req, res, next) => {
    const { productId } = req.params;
    try {
      await ProductsController.deleteById(productId, req.user);
      req.logger.debug("Removed product");
      res.status(200).json(buildResponseDelete());
    } catch (error) {
      req.logger.error("Error deleting");
      next(error);
    }
  }
);

export default router;
