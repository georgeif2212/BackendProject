import { Router } from "express";
import { authMiddleware } from "../../utils.js";
import UsersController from "../../controllers/users.controller.js";

const router = Router();

router.get("/profile", authMiddleware("jwt"), async (req, res, next) => {
  try {
    const user = await UsersController.getById(req.user._id);
    res.render("profile", { title: "Hello People 🖐️", user: user });
  } catch (error) {
    next(error);
  }
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Hello People 🖐️" });
});

router.get("/register", (req, res) => {
  res.render("register", { title: "Hello People 🖐️" });
});

router.get("/recovery-password", (req, res) => {
  res.render("recovery-password", { title: "Hello People 🖐️" });
});

export default router;
