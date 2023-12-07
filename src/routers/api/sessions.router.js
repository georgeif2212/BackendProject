import { Router } from "express";
import UserManager from "../../dao/User.manager.js";

const router = Router();

router.post("/sessions/login", async (req, res) => {
  try {
    const { body } = req;
    const user = await UserManager.login(body);

    const { first_name, last_name, age, role, email } = user;
    req.session.user = {
      first_name,
      last_name,
      email,
      age,
      role,
    };
    res.redirect("/views/profile");
  } catch (error) {
    res.status(400).render("error", {
      title: "Errores",
      messageError: error.message,
    });
  }
});

router.post("/sessions/register", async (req, res) => {
  try {
    const { body } = req;
    await UserManager.register(body);
    res.redirect("/views/login");
  } catch (error) {
    res.status(400).render("error", {
      title: "Errores",
      messageError: error.message,
    });
  }
});

router.get("/sessions/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "No estas autenticado." });
  }
  res.status(200).json(req.session.user);
});

router.get("/session/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.render("error", {
        title: "Hello People 🖐️",
        messageError: error.message,
      });
    }
    res.redirect("/views/login");
  });
});

export default router;
