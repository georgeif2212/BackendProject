import passport from "passport";
import { validateToken } from "../utils/utils.js";

export const tokenRecoverPassword = async (req, res, next) => {
  const token = req.query.token;
  const payload = await validateToken(token);
  if (!payload) {
    return res.status(401).json({
      message: "JWT Token is invalid, do you want to recover password again?",
      recover: "http://localhost:8080/views/email-recover-password",
      login: "http://localhost:8080/views/login",
    });
  }
  if (payload.type != "recoverPassword") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = payload;
  next();
};

export const authMiddleware = (strategy) => (req, res, next) => {
  passport.authenticate(strategy, function (error, payload, info) {
    if (error) {
      return next(error);
    }
    if (!payload || payload.type !== "auth") {
      return res.status(401).json({
        message: info.message ? info.message : info.toString(),
        login: "http://localhost:8080/views/login",
      });
    }
    req.user = payload;
    res.locals.accessToken = req.signedCookies["access_token"] || null;
    next();
  })(req, res, next);
};

export const authRolesMiddleware = (roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { role: userRole } = req.user;
  if (!roles.includes(userRole)) {
    return res.status(403).json({
      message: "forbidden 😨",
      return: "http://localhost:8080/views/profile",
    });
  }
  next();
};
