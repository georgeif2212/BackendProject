import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import UsersController from "../../controllers/users.controller.js";
import { tokenRecoverPassword } from "../../middlewares/auth.middleware.js";

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

router.get("/email-recover-password", (req, res) => {
  res.render("email-recover-password", { title: "Recover password-email 🖐️" });
});

router.get("/create-new-password", tokenRecoverPassword, async (req, res) => {
  res.render("create-new-password", {
    title: "Recover password 🖐️",
    token: req.query.token,
  });
});

router.get("/upload-documents", authMiddleware("jwt"), (req, res) => {
  res.render("upload-documents", {
    title: "Upload documents",
    uid: req.user._id,
  });
});

export default router;
