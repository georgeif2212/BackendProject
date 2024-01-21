import { Router } from "express";
import UsersController from "../../controllers/users.controller.js";
import passport from "passport";

const router = Router();

router.post(
  "/sessions/login",
  passport.authenticate("login", { failureRedirect: "/views/login" }),
  async (req, res) => {
    // try {
    //   const { body } = req;
    //   const user = await UsersController.login(body);

    //   const { first_name, last_name, age, role, email, password } = user;
    //   req.session.user = {
    //     first_name,
    //     last_name,
    //     email,
    //     age,
    //     role:
    //       email === "adminCoder@coder.com" && password === "adminCod3r123"
    //         ? "admin"
    //         : "user",
    //   };
    res.redirect("/views/profile");
    // } catch (error) {
    //   res.status(400).render("error", {
    //     title: "Errores",
    //     messageError: error.message,
    //   });
    // }
  }
);

router.post(
  "/sessions/register",
  passport.authenticate("register", { failureRedirect: "/views/register" }),
  async (req, res) => {
    res.redirect("/views/login");
    // try {
    //   const { body } = req;
    //   await UsersController.register(body);
    //   res.redirect("/views/login");
    // } catch (error) {
    //   res.status(400).render("error", {
    //     title: "Errores",
    //     messageError: error.message,
    //   });
    // }
  }
);

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

router.get("/sessions/logout", (req, res) => {
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
