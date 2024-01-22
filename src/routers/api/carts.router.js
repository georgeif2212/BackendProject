import { Router } from "express";
import CartsController from "../../controllers/carts.controller.js";
import {
  NotFoundException,
  authMiddleware,
  authRolesMiddleware,
  buildResponsePaginatedCarts,
} from "../../utils.js";
import TicketsController from "../../controllers/tickets.controller.js";

const router = Router();

const carts = [
  {
    id: "8e1e9f2c-41e6-48b8-8fc5-33a9c0e7da1f",
    products: [
      {
        id: 1,
        title: "Esto es para actualizar el producto 1 por su id",
        description: "Este es un producto actualizado 1",
        quantity: 3,
      },
      {
        id: 5,
        title: "Producto prueba 5",
        description: "Este es un producto prueba 5",
        price: 543,
        quantity: 12,
      },
    ],
  },
  {
    id: "3df64235-0e45-44c8-a082-378677ef7f96",
    products: [
      {
        id: 10,
        title: "Producto prueba 10",
        description: "Este es un producto prueba 10",
        price: 654,
        quantity: 5,
      },
      {
        id: "faddee08-eb7d-426d-abe5-7ecb3c83aaf2",
        title: "Producto prueba POST",
        description: "Este es un producto prueba POST",
        price: 2924.45,
        quantity: 9,
      },
    ],
  },
];

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
  console.log(result);
  res
    .status(200)
    .json(buildResponsePaginatedCarts({ ...result, sort, search }));
});

// ! Añade un nuevo carrito vacío
router.post("/carts", async (req, res, next) => {
  try {
    const products = [];
    const cart = await CartsController.create(products);
    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
});

// ! Muestra el carrito con id específico
router.get("/carts/:cartId", async (req, res, next) => {
  const { cartId } = req.params;
  try {
    const cart = await CartsController.getById(cartId);
    res.status(200).json({ id: cart.id, products: cart.products });
  } catch (error) {
    next(error);
  }
});

// !* Añade al carrito con id: el producto con id: (en caso de que no exista el producto
// !* en el carrito se agrega, si no se le suma la cantidad)
router.post(
  "/carts/:cartId/products/:productId",
  authMiddleware("jwt"),
  authRolesMiddleware(["user"]),
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
      res.status(200).json({
        id: cart.id,
        products: cartProducts,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ! Elimina del carrito un producto seleccionado
router.delete("/carts/:cartId/products/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const cart = await CartsController.getById(cartId);
    const cartProducts = cart.products;

    const productIndex = cartProducts.findIndex(
      (product) => product.product.toString() === productId
    );

    if (productIndex === -1) {
      throw new Error(
        `Product with ${productId} not found in the cart ${cartId}`
      );
    } else {
      // ! Si el producto existe eliminarlo del carrito
      cartProducts.splice(productIndex, 1);
    }

    await CartsController.updateById(cartId, cartProducts);
    res.status(200).json({
      id: cart.id,
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
    await CartsController.updateById(cartId, cartProducts);
    res.status(200).json({
      id: cart.id,
      products: cartProducts,
    });
  } catch (error) {
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
      // ! Si el producto no existe
      throw new NotFoundException(
        `Product with ID: ${productId} not found in the cart: ${cartId}`
      );
    } else {
      // ! Si el producto existe actualizar la cantidad del producto
      cartProducts[productIndex].quantity += quantity;
    }

    await CartsController.updateById(cartId, cartProducts);
    res.status(200).json({
      id: cart.id,
      products: cartProducts,
    });
  } catch (error) {
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
      id: cart.id,
      products: cartProducts,
    });
  } catch (error) {
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
      const availableProducts = await CartsController.doPurchase(cartId);
      const ticket = await TicketsController.create({
        availableProducts,
        ...req.user,
      });
      res.status(200).json(ticket);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
