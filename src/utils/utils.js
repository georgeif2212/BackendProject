import path from "path";
import url from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { faker } from "@faker-js/faker";

const __filename = url.fileURLToPath(import.meta.url);
const JWT_SECRET = config.jwtSecret;
export const __dirname = path.dirname(__filename);

export const buildResponsePaginated = (
  data,
  baseUrl = URL_BASE,
  payloadKey
) => {
  return {
    status: "success",
    payload: data[payloadKey],
    totalPages: data.totalPages,
    infoUser: data.infoUser,
    prevPage: data.prevPage,
    nextPage: data.nextPage,
    page: data.page,
    hasPrevPage: data.hasPrevPage,
    hasNextPage: data.hasNextPage,
    prevLink: data.hasPrevPage
      ? `${baseUrl}?limit=${data.limit}&page=${data.prevPage}`
      : null,
    nextLink: data.hasNextPage
      ? `${baseUrl}?limit=${data.limit}&page=${data.nextPage}`
      : null,
  };
};
export const URL_BASE = "http://localhost:8080/api";
export const buildResponsePaginatedProducts = (
  data,
  baseUrl = `${URL_BASE}/products`
) => {
  return buildResponsePaginated(data, baseUrl, "products");
};

export const buildResponsePaginatedUsers = (
  data,
  baseUrl = `${URL_BASE}/users`
) => {
  return buildResponsePaginated(data, baseUrl, "users");
};

export const buildResponsePaginatedCarts = (
  data,
  baseUrl = `${URL_BASE}/carts`
) => {
  return buildResponsePaginated(data, baseUrl, "carts");
};

export const buildGeneralResponse = (payload) => {
  return {
    status: "success",
    payload: payload,
  };
};

export const buildResponseUpdate = () => {
  return {
    status: "success",
    message: "The resource has been updated succesfully",
  };
};

export const buildResponseDelete = () => {
  return {
    status: "success",
    message: "The resource has been deleted succesfully",
  };
};

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) =>
  bcrypt.compareSync(password, user.password);

export const generateToken = (user, type = "auth") => {
  const { _id, first_name, email, role } = user;
  const payload = { _id, first_name, email, role, type };
  const expiresIn = type === "auth" ? "30m" : "1h";
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
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

// * Función to delete inactive users
export const inactiveUsers = (user) => {
  const currentDate = new Date();
  const lastConnectionDate = new Date(user.last_connection);
  const timeDifference = currentDate.getTime() - lastConnectionDate.getTime();
  const daysDifference = timeDifference / (1000 * 3600 * 24); // Convertir a días

  // * Eliminar usuarios que no se han conectado en más de 30 días
  if (daysDifference > 30) return user;
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
