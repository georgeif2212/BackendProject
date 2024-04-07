import { Router } from "express";
import CartsController from "../../controllers/carts.controller.js";
import {
  authMiddleware,
  authRolesMiddleware,
} from "../../middlewares/auth.middleware.js";
import { buildResponsePaginatedCarts } from "../../utils/utils.js";
import TicketsController from "../../controllers/tickets.controller.js";
import { CustomError } from "../../utils/CustomError.js";
import { generatorProductIdError } from "../../utils/CauseMessageError.js";
import EnumsError from "../../utils/EnumsError.js";
import PaymentsService from "../../services/payments.service.js";

const router = Router();

// ! Muestra todos los carritos
router.get("/carts", async (req, res) => {
  const { limit = 1, page = 1, sort, search } = req.query;

  const criteria = {};
  const options = { limit, page };
  if (sort) {
    options.sort = { products: sort };
  }
  if (search) {
    criteria._id = search;
  }

  const result = await CartsController.get(criteria, options);
  req.logger.debug("Debug message: result", result);
  res
    .status(200)
    .json(buildResponsePaginatedCarts({ ...result, sort, search }));
});

// ! Añade un nuevo carrito vacío
router.post("/carts", async (req, res, next) => {
  try {
    const products = [];
    const cart = await CartsController.create(products);
    req.logger.debug("Debug message: cart", cart);
    res.status(201).json(cart);
  } catch (error) {
    req.logger.error("Error message: ", error);
    next(error);
  }
});

// ! Muestra el carrito con id específico
router.get("/carts/:cartId", async (req, res, next) => {
  const { cartId } = req.params;
  try {
    const cart = await CartsController.getById(cartId);
    res.status(200).json({ id: cart._id, products: cart.products });
  } catch (error) {
    req.logger.error("Error message: ", error);
    next(error);
  }
});

// !* Añade al carrito con id: el producto con id: (en caso de que no exista el producto
// !* en el carrito se agrega, si no se le suma la cantidad)
router.post(
  "/carts/:cartId/products/:productId",
  authMiddleware("jwt"),
  authRolesMiddleware(["user", "premium"]),
  async (req, res, next) => {
    try {
      const { cartId, productId } = req.params;
      const { quantity } = req.body;
      const cart = await CartsController.getById(cartId);

      const cartProducts = cart.products;

      const productIndex = cartProducts.findIndex(
        (product) => product.product._id == productId
      );

      // ! Si el producto no existe
      if (productIndex === -1) {
        const newProduct = {
          product: productId,
          quantity,
        };
        cartProducts.push(newProduct);
      } else {
        // ! Si el producto existe actualizar la cantidad del producto
        cartProducts[productIndex].quantity += quantity;
      }

      await CartsController.updateById(cartId, cartProducts);
      res.status(201).json({
        _id: cart._id,
        products: cartProducts,
      });
    } catch (error) {
      req.logger.error("Error message: ", error);
      next(error);
    }
  }
);

// ! Elimina del carrito un producto seleccionado
router.delete("/carts/:cartId/products/:productId", async (req, res, next) => {
  try {
    const { cartId, productId } = req.params;
    const cart = await CartsController.getById(cartId);
    const cartProducts = cart.products;
    const productIndex = cartProducts.findIndex(
      (element) => element.product._id.toString() === productId
    );
    if (productIndex === -1) {
      CustomError.create({
        name: "Product not found",
        cause: generatorProductIdError(productId),
        message: `Product with ${productId} not found in the cart ${cartId}`,
        code: EnumsError.NOT_FOUND_ERROR,
      });
    } else {
      // ! Si el producto existe eliminarlo del carrito
      cartProducts.splice(productIndex, 1);
    }

    await CartsController.updateById(cartId, cartProducts);
    res.status(200).json({
      _id: cart._id,
      products: cartProducts,
    });
  } catch (error) {
    next(error);
  }
});

// ! Actualiza todo el array productos del carrito seleccionado
// Se le debe pasar el arreglo asÍ:
// [
//   {
//       "product": "655915890e292adf21f99173",
//       "quantity": 2
//   },
//   {
//       "product": "655915890e292adf21f99172",
//       "quantity": 4
//   }
// ]
router.put("/carts/:cartId", async (req, res) => {
  const { body, params } = req;
  const { cartId } = params;
  try {
    const cart = await CartsController.getById(cartId);
    let cartProducts = cart.products;
    cartProducts = body;
    req.logger.debug("Debug message: cartProducts", cartProducts);
    await CartsController.updateById(cartId, cartProducts);
    res.status(200).json({
      _id: cart._id,
      products: cartProducts,
    });
  } catch (error) {
    req.logger.error("Error message: ", error);
    next(error);
  }
});

// ! Actualiza solo la cantidad del producto que pertenece a un carrito
router.put("/carts/:cartId/products/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;
    const cart = await CartsController.getById(cartId);
    const cartProducts = cart.products;

    const productIndex = cartProducts.findIndex(
      (product) => product.product.toString() === productId
    );

    if (productIndex === -1) {
      CustomError.create({
        name: "Product not found",
        cause: generatorProductIdError(productId),
        message: `Product with ${productId} not found in the cart ${cartId}`,
        code: EnumsError.NOT_FOUND_ERROR,
      });
    } else {
      // ! Si el producto existe actualizar la cantidad del producto
      cartProducts[productIndex].quantity += quantity;
    }

    await CartsController.updateById(cartId, cartProducts);
    res.status(200).json({
      _id: cart._id,
      products: cartProducts,
    });
  } catch (error) {
    req.logger.error("Error message: ", error);
    next(error);
  }
});

// ! Elimina todos los productos del array products
router.delete("/carts/:cartId", async (req, res) => {
  const { params } = req;
  const { cartId } = params;
  try {
    const cart = await CartsController.getById(cartId);
    const cartProducts = [];
    await CartsController.updateById(cartId, cartProducts);
    res.status(200).json({
      _id: cart._id,
      products: cartProducts,
    });
  } catch (error) {
    req.logger.error("Error message: ", error);
    next(error);
  }
});

// ! Ticket de compra
router.post(
  "/carts/:cartId/purchase",
  authMiddleware("jwt"),
  async (req, res, next) => {
    try {
      const { cartId } = req.params;
      const ticket = await TicketsController.create({
        availableProducts,
        user: req.user,
      });
      res.status(200).json(ticket);
    } catch (error) {
      req.logger.error("Error message: ", error);
      next(error);
    }
  }
);

export default router;
