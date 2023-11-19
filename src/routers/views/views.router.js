// import ProductManager from "../dao/ProductManagerFS.js";
import ProductsManager from "../../dao/Products.manager.js";
import path from "path";
import { __dirname } from "../../utils.js";
import { Router } from "express";
import { emit } from "../../socket.js";

const router = Router();
// * Ruta con path porque sin ella no me daba
// const productManager = new ProductManager(
//   path.join(__dirname, "../Products.json")
// );

// export const products = await productManager.getProducts();

// ! ENDPOINTS FOR PRODUCTS
router.get("/products", async (req, res) => {
  const { query } = req;
  const { limit } = query;
  if (!limit) {
    const products = await ProductsManager.get();
    res.status(200).render("home", {
      title: "Products 🧴",
      products: products.map((product) => product.toJSON()),
    });
  } else {
    const products = await ProductsManager.get(parseInt(limit));
    res.status(200).render("home", {
      title: "Limited Products 🧴",
      products: products.map((product) => product.toJSON()),
    });
  }
});

// ! ENDPOINTS FOR REALTIMEPRODUCTS
router.get("/realtimeproducts", async (req, res) => {
  const { query } = req;
  const { limit } = query;

  if (!limit) {
    const products = await ProductsManager.get();
    emit("update-list-products", { products });
    res.render("realTimeProducts", { title: "Products 🧴" });
  } else {
    const products = await ProductsManager.get(parseInt(limit));
    emit("update-list-products", { products });
    res.render("realTimeProducts", { title: "Limited Products 🧴" });
  }
});

export default router;
