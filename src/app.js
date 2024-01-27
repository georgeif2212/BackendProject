import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { Exception, __dirname } from "./utils/utils.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import config from "./config/config.js";

import productsRouter from "./routers/api/products.router.js";
import mocksRouter from "./routers/api/mocks.router.js";
import cartsRouter from "./routers/api/carts.router.js";
import viewsRouter from "./routers/views/views.router.js";
import sessionsRouter from "./routers/api/sessions.router.js";
import indexRouter from "./routers/views/index.router.js";
import { init as initPassport } from "./config/passport.config.js";
import { errorHandlerMiddleware } from "./middlewares/error-handle.middleware.js";

const app = express();

app.use(cookieParser(config.cookieSecret));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../../public")));

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, ".././views"));
app.set("view engine", "handlebars");

initPassport();
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.redirect("/views/login");
});

app.use("/api", productsRouter, cartsRouter, sessionsRouter, mocksRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/views", viewsRouter, indexRouter);

// ! Middleware de error
app.use(errorHandlerMiddleware);
// app.use((error, req, res, next) => {
//   const message =
//     error instanceof Exception
//       ? error.message
//       : `Ha ocurrido un error desconocido: ${error.message}`;
//   console.log(message);
//   res.status(error.statusCode || 500).json({ status: "error", message });
// });

export default app;
