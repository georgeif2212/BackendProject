import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { __dirname } from "./utils.js";
import { URI } from "./db/mongodb.js";
import sessions from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import config from './config/config.js';

import productsRouter from "./routers/api/products.router.js";
import cartsRouter from "./routers/api/carts.router.js";
import viewsRouter from "./routers/views/views.router.js";
import sessionsRouter from "./routers/api/sessions.router.js";
import indexRouter from "./routers/views/index.router.js";
import { init as initPassport } from "./config/passport.config.js";

const app = express();

const SESSION_SECRET = config.sessionSecret;

app.use(
  sessions({
    store: MongoStore.create({
      mongoUrl: URI,
      mongoOptions: {},
      ttl: 60 * 30,
    }),
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

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
