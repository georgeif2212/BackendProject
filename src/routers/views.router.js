import ProductManager from "../ProductManager.js";
import path from "path";
import { __dirname } from "../utils.js";
import { Router } from "express";
import { emit } from "../socket.js";

const router = Router();
// * Ruta con path porque sin ella no me daba
const productManager = new ProductManager(
  path.join(__dirname, "../Products.json")
);

export const products = await productManager.getProducts();

// ! ENDPOINTS FOR PRODUCTS
router.get("/products", async (req, res) => {
  const { query } = req;
  const { limit } = query;
  let productsToRender;
  if (!limit) {
    productsToRender = products;
    res.status(200).render("home", { title: "Products 🧴", productsToRender });
  } else {
    productsToRender = products.slice(0, parseInt(limit));
    res
      .status(200)
      .render("home", { title: "Limited Products 🧴", productsToRender });
  }
});

// ! ENDPOINTS FOR REALTIMEPRODUCTS
router.get("/realtimeproducts", async (req, res) => {
  const { query } = req;
  const { limit } = query;

  if (!limit) {
    emit("update-list-products", { products });
    res.render("realTimeProducts", { title: "Products 🧴" });
  } else {
    products = products.slice(0, parseInt(limit));
    emit("update-list-products", { products });
    res.render("realTimeProducts", { title: "Limited Products 🧴" });
  }
});

export default router;
