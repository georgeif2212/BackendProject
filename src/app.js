import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { Exception, __dirname } from "./utils.js";
import passport from "passport";
import cookieParser from "cookie-parser";

import productsRouter from "./routers/api/products.router.js";
import cartsRouter from "./routers/api/carts.router.js";
import viewsRouter from "./routers/views/views.router.js";
import sessionsRouter from "./routers/api/sessions.router.js";
import indexRouter from "./routers/views/index.router.js";
import { init as initPassport } from "./config/passport.config.js";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "handlebars");

initPassport();
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.redirect("/views/login");
});

app.use("/api", productsRouter, cartsRouter, sessionsRouter);
app.use("/views", viewsRouter, indexRouter);

// ! Middleware de error
app.use((error, req, res, next) => {
  const message =
    error instanceof Exception
      ? error.message
      : `Ha ocurrido un error desconocido: ${error.message}`;
  console.log(message);
  res.status(error.statusCode || 500).json({ status: "error", message });
});

export default app;
