import ProductsManager from "../../dao/Products.manager.js";
import { __dirname } from "../../utils.js";
import { Router } from "express";
import { emit } from "../../socket.js";
import { buildResponsePaginated } from "../../utils.js";

const router = Router();
// * Ruta con path porque sin ella no me daba
// const productManager = new ProductManager(
//   path.join(__dirname, "../Products.json")
// );

// export const products = await productManager.getProducts();

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
  const baseUrl = "http://localhost:8080/views/products";
  const result = await ProductsManager.get(criteria, options);
  const data = buildResponsePaginated({ ...result, sort, search }, baseUrl);
  res.status(200).render("home", {
    title: "Products 🧴",
    ...data,
  });
});

// ! ENDPOINTS FOR REALTIMEPRODUCTS
router.get("/realtimeproducts", async (req, res) => {
  const { limit = 10, page = 1, sort, search } = req.query;

  const criteria = {};
  const options = { limit, page };
  if (sort) {
    options.sort = { price: sort };
  }
  if (search) {
    criteria.title = search;
  }
  const products = await ProductsManager.get(criteria, options);
  emit("update-list-products", { products });
  res.render("realTimeProducts", { title: "Limited Products 🧴" });
});

// ! ENDPOINTS FOR CHAT
router.get("/chat", async (req, res) => {
  res.render("chat", { title: "Chat 😎" });
});

export default router;
