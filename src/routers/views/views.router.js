import ProductsController from "../../controllers/products.controller.js";
import CartsController from "../../controllers/carts.controller.js";
import { __dirname } from "../../utils/utils.js";
import {
  authMiddleware,
  authRolesMiddleware,
} from "../../middlewares/auth.middleware.js";
import { Router } from "express";
import { emit } from "../../socket.js";
import { buildResponsePaginated } from "../../utils/utils.js";
import UsersController from "../../controllers/users.controller.js";
import TicketsController from "../../controllers/tickets.controller.js";

const router = Router();
// * Ruta con path porque sin ella no me daba
// const productManager = new ProductManager(
//   path.join(__dirname, "../Products.json")
// );

// export const products = await productManager.getProducts();

// ! ENDPOINTS FOR PRODUCTS
router.get(
  "/products",
  authMiddleware("jwt"),
  authRolesMiddleware(["user"]),
  async (req, res) => {
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
    const result = await ProductsController.get(criteria, options);
    const infoUser = await UsersController.getById(req.user._id);
    const data = buildResponsePaginated(
      { ...result, sort, search, infoUser },
      baseUrl
    );
    res.status(200).render("home", {
      title: "Products 🧴",
      ...data,
    });
  }
);

router.get(
  "/editProducts",
  authMiddleware("jwt"),
  authRolesMiddleware(["admin"]),
  async (req, res) => {
    res.status(200).render("add-delete-products", { title: "Modify products" });
  }
);

// ! ENDPOINTS FOR REALTIMEPRODUCTS
router.get("/realtimeproducts", authMiddleware("jwt"), async (req, res) => {
  const products = await ProductsController.getAll();
  emit("update-list-products", { products });
  res.render("realTimeProducts", { title: "Limited Products 🧴" });
});

// ! ENDPOINTS FOR CHAT
router.get(
  "/chat",
  authMiddleware("jwt"),
  authRolesMiddleware(["user"]),
  async (req, res) => {
    res.render("chat", { title: "Chat 😎" });
  }
);

// ! ENDPOINTS FOR SPECIFIC CART
router.get("/carts/:cartId", authMiddleware("jwt"), async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const user = await UsersController.getById(req.user._id);
    if (user.cartId != cartId) {
      res.status(400).render("error", {
        title: "Errores",
        messageError: "No estás permitido",
      });
    }
    const cart = await CartsController.getById(cartId);
    res.status(200).render("carts", { title: "Carts", ...cart });
  } catch (error) {
    next(error);
  }
});

router.get("/tickets", authMiddleware("jwt"), async (req, res, next) => {
  try {
    const tickets = await TicketsController.getByEmail(req.user.email);
    res.status(200).render("tickets", { title: "Tickets 📄", tickets });
  } catch (error) {
    next(error);
  }
});

export default router;
