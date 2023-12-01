import { Router } from "express";
import UserManager from "../../dao/User.manager.js";

const router = Router();

router.post("/sessions/login", async (req, res) => {
  const {
    body: { email, password },
  } = req;

  if (!email || !password) {
    return res.render("error", {
      title: "Hello People 🖐️",
      messageError: "Todos los campos son requeridos.",
    });
  }
  const user = await UserManager.login(email);
  if (!user) {
    return res.render("error", {
      title: "Hello People 🖐️",
      messageError: "Correo o contraseña invalidos.",
    });
  }

  if (user.password !== password) {
    return res.render("error", {
      title: "Hello People 🖐️",
      messageError: "Correo o contraseña invalidos.",
    });
  }
  const { first_name, last_name, age, role } = user;
  req.session.user = {
    first_name,
    last_name,
    email,
    age,
    role,
  };
  res.redirect("/profile");
});

export default router;
