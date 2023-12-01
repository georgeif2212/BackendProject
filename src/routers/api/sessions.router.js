import { Router } from "express";
import UserManager from "../../dao/User.manager.js";

const router = Router();



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

export default router;
