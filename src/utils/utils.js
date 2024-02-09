import path from "path";
import url from "url";
import bcrypt from "bcrypt";
import passport from "passport";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import EmailService from "../services/email.service.js";
import { faker } from '@faker-js/faker';
// import emailTemplate from "./resources/welcomeEmail.html";

const __filename = url.fileURLToPath(import.meta.url);
const JWT_SECRET = config.jwtSecret;
export const __dirname = path.dirname(__filename);

export const URL_BASE = "http://localhost:8080/api/products";

export const buildResponsePaginated = (data, baseUrl = URL_BASE) => {
  return {
    //status:success/error
    status: "success",
    //payload: Resultado de los productos solicitados
    payload: data.products,
    //payload: Resultado de los productos solicitados
    infoUser: data.infoUser,
    //totalPages: Total de páginas
    totalPages: data.totalPages,
    //prevPage: Página anterior
    prevPage: data.prevPage,
    //nextPage: Página siguiente
    nextPage: data.nextPage,
    //page: Página actual
    page: data.page,
    //hasPrevPage: Indicador para saber si la página previa existe
    hasPrevPage: data.hasPrevPage,
    //hasNextPage: Indicador para saber si la página siguiente existe.
    hasNextPage: data.hasNextPage,
    //prevLink: Link directo a la página previa (null si hasPrevPage=false)
    prevLink: data.hasPrevPage
      ? `${baseUrl}?limit=${data.limit}&page=${data.prevPage}`
      : null,
    //nextLink: Link directo a la página siguiente (null si hasNextPage=false)
    nextLink: data.hasNextPage
      ? `${baseUrl}?limit=${data.limit}&page=${data.nextPage}`
      : null,
  };
};

export const URL_BASE_CARTS = "http://localhost:8080/api/carts";
export const buildResponsePaginatedCarts = (data, baseUrl = URL_BASE_CARTS) => {
  return {
    //status:success/error
    status: "success",
    //payload: Resultado de los productos solicitados
    payload: data.carts,
    //totalPages: Total de páginas
    totalPages: data.totalPages,
    //prevPage: Página anterior
    prevPage: data.prevPage,
    //nextPage: Página siguiente
    nextPage: data.nextPage,
    //page: Página actual
    page: data.page,
    //hasPrevPage: Indicador para saber si la página previa existe
    hasPrevPage: data.hasPrevPage,
    //hasNextPage: Indicador para saber si la página siguiente existe.
    hasNextPage: data.hasNextPage,
    //prevLink: Link directo a la página previa (null si hasPrevPage=false)
    prevLink: data.hasPrevPage
      ? `${baseUrl}?limit=${data.limit}&page=${data.prevPage}`
      : null,
    //nextLink: Link directo a la página siguiente (null si hasNextPage=false)
    nextLink: data.hasNextPage
      ? `${baseUrl}?limit=${data.limit}&page=${data.nextPage}`
      : null,
  };
};

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) =>
  bcrypt.compareSync(password, user.password);


export const generateToken = (user) => {
  const { _id, first_name, email, role } = user;
  const payload = { _id, first_name, email, role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30m" });
};

export const validateToken = (token) => {
  return new Promise((resolve) => {
    jwt.verify(token, JWT_SECRET, (error, payload) => {
      if (error) {
        return resolve(false);
      }
      resolve(payload);
    });
  });
};

export const authMiddleware = (strategy) => (req, res, next) => {
  passport.authenticate(strategy, function (error, payload, info) {
    if (error) {
      return next(error);
    }
    if (!payload) {
      return res.status(401).json({
        message: info.message ? info.message : info.toString(),
        login: "http://localhost:8080/views/login",
      });
    }
    req.user = payload;
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

export const sendWelcomeEmail = async (user) => {
  const emailService = EmailService.getInstance();
  const result = await emailService.sendEmail(
    user.email,
    `Bienvenido ${user.first_name}!`,
    `<div>
      <h1>Hola ${user.first_name}! Soy Jorge.</h1>
      <h2>Te damos la bienvenida</h2>
      <img src="cid:hello" alt="Hello" />
    </div>`,
    [
      {
        filename: "hello.png",
        path: path.join(__dirname, "../resources/hello.png"),
        cid: "hello",
      },
    ]
  );
  return result;
};

export const generateProduct = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    code: faker.string.alphanumeric({ length: 10 }),
    price: faker.commerce.price(),
    category: faker.commerce.department(),
    stock: faker.number.int({ min: 10000, max: 99999 }),
    image: faker.image.url(),
  };
};
