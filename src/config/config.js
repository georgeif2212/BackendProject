import dotenv from "dotenv";

dotenv.config();
export default {
  port: process.env.PORT || 8080,
  mongodbUri:
    process.env.NODE_ENV == "testing"
      ? process.env.MONGODB_URI_TEST
      : process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  env: process.env.NODE_ENV || "development",
  mail: {
    emailService: process.env.EMAIL_SERVICE || "gmail",
    emailPort: process.env.EMAIL_PORT || 587,
    emailUser: process.env.EMAIL_USER,
    emailPassword: process.env.EMAIL_PASSWORD,
  },
  stripeBackendKey: process.env.STRIPE_BACKEND_KEY,
};
