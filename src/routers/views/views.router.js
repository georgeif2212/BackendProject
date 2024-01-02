import ProductsManager from "../../dao/Products.manager.js";
import CartsManager from "../../dao/Carts.manager.js";
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
  if (!req.user) {
    return res.render("error", {
      title: "Hello People 🖐️",
      messageError: "No estas autenticado.",
    });
  }

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
  const infoUser = req.user;
  const data = buildResponsePaginated(
    { ...result, sort, search, infoUser },
    baseUrl
  );
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

// ! ENDPOINTS FOR SPECIFIC CART
router.get("/carts/:cartId", async (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = await CartsManager.getById(cartId);
    const result = cart.toJSON();
    res.status(200).render("carts", { title: "Carts", ...result });
  } catch (error) {
    res.status(400).render("error", {
      title: "Errores",
      messageError: error.message,
    });
  }
});

export default router;
