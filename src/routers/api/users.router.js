import { Router } from "express";
import UsersController from "../../controllers/users.controller.js";
import {
  authMiddleware,
  authRolesMiddleware,
} from "../../middlewares/auth.middleware.js";
import { CustomError } from "../../utils/CustomError.js";
import { generatorProductIdError } from "../../utils/CauseMessageError.js";
import EnumsError from "../../utils/EnumsError.js";

const router = Router();

router.patch("/premium/:uid", async (req, res, next) => {
  try {
    await UsersController.premiumOrNotUser(req.params);
    res.status(201).json({ message: "The user role has been changed" });
  } catch (error) {
    next(error);
  }
});

router.delete("/:uid", async (req, res, next) => {
  await UsersController.deleteById(req.params.uid);
  res.status(204);
});

export default router;
