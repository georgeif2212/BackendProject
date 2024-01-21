import dotenv from "dotenv";

dotenv.config();
export default {
  port: process.env.PORT,
  mongodbUri: process.env.MONGODB_URI,
  persistence: process.env.PERSISTENCE || "memory",
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
};
