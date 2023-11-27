import { Router } from "express";
import { v4 as uuidV4 } from "uuid";
import CartsManager from "../../dao/Carts.manager.js";

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

router.get("/carts", async (req, res) => {
  const { query } = req;
  const { limit } = query;

  if (!limit) {
    const carts = await CartsManager.get();
    res.status(200).json(carts);
  } else {
    const carts = await CartsManager.get(parseInt(limit));
    res.status(200).json(carts);
  }
});

router.post("/carts", async (req, res) => {
  const { body } = req;
  try {
    const cart = await CartsManager.create(body);
    res.status(201).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/carts/:cartId", async (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = await CartsManager.getById(cartId);
    res.status(200).json({ id: cart.id, products: cart.products });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/carts/:cartId/products/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const { title, description, quantity } = req.body;
    const cart = await CartsManager.getById(cartId);
    const cartProducts = cart.products;

    const productIndex = cartProducts.findIndex(
      (product) => product.id == productId
    );

    if (productIndex === -1) {
      // ! Si el producto no existe
      const newProduct = {
        id: productId,
        title,
        description,
        quantity,
      };
      cartProducts.push(newProduct);
    } else {
      // ! Si el producto existe actualizar la cantidad del producto
      cartProducts[productIndex].quantity += quantity;
    }

    await CartsManager.updateById(cartId, cartProducts);
    res.status(200).json({
      id: cart.id,
      products: cartProducts,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;