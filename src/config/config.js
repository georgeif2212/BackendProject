import dotenv from "dotenv";

dotenv.config();
export default {
  port: process.env.PORT,
  mongodbUri: process.env.MONGODB_URI,
  sessionSecret: process.env.SESSION_SECRET,
  persistence: process.env.PERSISTENCE || "memory",
  jwtSecret: process.env.JWT_SECRET,
};
