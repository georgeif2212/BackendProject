import { Router } from "express";
import UsersController from "../../controllers/users.controller.js";
import passport from "passport";
import { generateToken } from "../../utils.js";

const router = Router();

router.post("/sessions/login", async (req, res, next) => {
  try {
    const { body } = req;
    const user = await UsersController.login(body);
    const token = generateToken(user);
    res
      .cookie("access_token", token, {
        maxAge: 1000 * 60 * 30,
        httpOnly: true,
        signed: true,
      })
      .status(200)
      .redirect("/views/profile");
  } catch (error) {
    next(error);
  }
});

router.post("/sessions/register", async (req, res, next) => {
  res.redirect("/views/login");
  try {
    const { body } = req;
    await UsersController.register(body);
    res.redirect("/views/login");
  } catch (error) {
    next(error);
  }
});

router.post("/sessions/recovery-password", async (req, res, next) => {
  try {
    const { body } = req;
    await UsersController.recoverPassword(body);
    res.redirect("/views/login");
  } catch (error) {
    next(error);
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

router.get(
  "/sessions/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/sessions/github/callback",
  passport.authenticate("github", { failureRedirect: "/views/login" }),
  (req, res) => {
    res.redirect("/views/profile");
  }
);

export default router;
