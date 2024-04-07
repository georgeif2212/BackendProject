import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { __dirname } from "./utils/utils.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import loggerRouter from "./routers/api/logger.router.js";
import usersRouter from "./routers/api/users.router.js";
import productsRouter from "./routers/api/products.router.js";
import mocksRouter from "./routers/api/mocks.router.js";
import cartsRouter from "./routers/api/carts.router.js";
import paymentsRouter from "./routers/api/payment.router.js";
import viewsRouter from "./routers/views/views.router.js";
import sessionsRouter from "./routers/api/sessions.router.js";
import indexRouter from "./routers/views/index.router.js";
import { init as initPassport } from "./config/passport.config.js";
import { errorHandlerMiddleware } from "./middlewares/error-handle.middleware.js";
import { addLogger } from "./config/logger.js";

const app = express();

app.use(addLogger);
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

if (process.env.NODE_ENV !== "production") {
  const swaggerOpts = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Backend API",
        description: "Backend API Documentation",
      },
    },
    apis: [path.join(__dirname, "..", "docs", "**", "*.yaml")],
  };
  const specs = swaggerJsDoc(swaggerOpts);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}

app.use("/api", productsRouter, cartsRouter, sessionsRouter, mocksRouter);
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/payments", paymentsRouter);
app.use("/views", viewsRouter, indexRouter);
app.use("/logger", loggerRouter);

// ! Middleware de error
app.use(errorHandlerMiddleware);

export default app;
