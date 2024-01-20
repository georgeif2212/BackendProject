import { Router } from "express";

const router = Router();

router.get("/profile", (req, res) => {
  if (!req.user) {
    return res.redirect("/views/login");
  }
  console.log(req.user);
  // ? No entendí como modificar la ruta con el dto, ya que el req.user ya se le aplica el DTO desde que inicia sesión
  res.render("profile", { title: "Hello People 🖐️", user: req.user });
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
