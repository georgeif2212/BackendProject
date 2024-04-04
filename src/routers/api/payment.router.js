import { Router } from "express";
import {
  authMiddleware,
  authRolesMiddleware,
} from "../../middlewares/auth.middleware";

const router = Router();

router.get(
  "/intent",
  authRolesMiddleware[("user", "premium")],
  authMiddleware("jwt"),
  async (req, res, next) => {
    

  }
);

export default router;
