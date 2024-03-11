import { Router } from "express";
import UsersController from "../../controllers/users.controller.js";
import passport from "passport";
import { generateToken } from "../../utils/utils.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { nextTick } from "process";

const router = Router();

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/login", session: false }),
  async (req, res, next) => {
    const token = generateToken(req.user);
    res
      .cookie("access_token", token, {
        maxAge: 1000 * 60 * 30,
        httpOnly: true,
        signed: true,
      })
      .status(200)
      .redirect("/views/profile");
    // try {
    //   const { body } = req;
    //   const user = await UsersController.login(body);
    //   const token = generateToken(user);
    //   res
    //     .cookie("access_token", token, {
    //       maxAge: 1000 * 60 * 30,
    //       httpOnly: true,
    //       signed: true,
    //     })
    //     .status(200)
    //     .redirect("/views/profile");
    // } catch (error) {
    //   next(error);
    // }
  }
);

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/views/register",
    session: false,
  }),
  async (req, res, next) => {
    res.redirect("/views/login");
    // try {
    //   const { body } = req;
    //   await UsersController.register(body);
    //   res.redirect("/views/login");
    // } catch (error) {
    //   next(error);
    // }
  }
);

router.post("/email-recovery-password", async (req, res, next) => {
  try {
    const { body } = req;
    await UsersController.recoverPasswordbyEmail(body);
    res.redirect("/views/login");
  } catch (error) {
    next(error);
  }
});

router.post("/create-new-password", async (req, res, next) => {
  try {
    await UsersController.createNewPassword({ ...req.body, ...req.query });
    res.redirect("/views/login");
  } catch (error) {
    next(error);
  }
});

router.get("/me", authMiddleware("jwt"), (req, res) => {
  res.status(200).json(req.user);
});


router.get("/logout", (req, res) => {
  res.clearCookie("access_token").redirect("/views/login");
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/views/login",
  }),
  (req, res) => {
    const token = generateToken(req.user);
    res
      .cookie("access_token", token, {
        maxAge: 1000 * 60 * 30,
        httpOnly: true,
        signed: true,
      })
      .redirect("/views/profile");
  }
);

export default router;
