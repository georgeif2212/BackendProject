import { Router } from 'express';
import { v4 as uuidV4 } from 'uuid';

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

router.get("/carts", (req, res) => {
  res.status(200).json(carts);
});

router.post("/carts", (req, res) => {
  const { body } = req;
  const newCart = {
    id: uuidV4(),
    products: [body],
  };
  carts.push(newCart);
  res.status(201).json(newCart);
});

router.get("/carts/:cartId", (req, res) => {
  const { cartId } = req.params;
  const cart = carts.find((cart) => cart.id === cartId);

  if (!cart) return res.status(404).json({ error: "Cart not found." });

  const cartProducts = cart.products;
  res.status(200).json({
    id: cart.id,
    products: cartProducts,
  });
});

router.post("/carts/:cartId/products/:productId", (req, res) => {
  const { cartId, productId } = req.params;
  const { body } = req; //{quantity: 3}

  // * Busca al carrito que corresponda al cartID por params
  const cart = carts.find((cart) => cart.id == cartId);
  if (!cart) return res.status(404).json({ error: "Cart not found." });

  // * Busca al producto dentro del carrito que corresponda al productID por params
  const cartProducts = cart.products;

  const product = cartProducts.find((product) => product.id == productId);
  // * Si no hay producto añadir uno nuevo
  if (!product) {
    // * Crear el nuevo producto que se añadirá al carrito
    const newProduct = {
      id: productId,
      quantity: body.quantity,
    };
    cartProducts.push(newProduct);
  } else {
    product.quantity += body.quantity;
  }

  res.status(200).json({
    id: cart.id,
    products: cartProducts,
  });
});

export default router;
