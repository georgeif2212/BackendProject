import { Router } from "express";
import { generateProduct } from "../../utils/utils.js";

const router = Router();
// ! Muestra todos los carritos
router.get("/mockingproducts", async (req, res, next) => {
  try {
    const products = [];
    for (let index = 0; index < 100; index++) {
      products.push(generateProduct());
    }
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

export default router;
