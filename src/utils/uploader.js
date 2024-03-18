import multer from "multer";
import { __dirname } from "./utils.js";
import path from "path";
import fs from "fs";

export const uploaderMiddleware = (typeFile) => {
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      let folderPath = null;
      switch (typeFile) {
        case "avatar":
          folderPath = path.resolve(
            __dirname,
            "..",
            "..",
            "public",
            "images",
            "profiles"
          );
          break;
        case "product":
          folderPath = path.resolve(
            __dirname,
            "..",
            "..",
            "public",
            "images",
            "products"
          );
          break;
        case "document":
          folderPath = path.resolve(
            __dirname,
            "..",
            "..",
            "public",
            "documents"
          );
          break;
        default:
          return callback(new InvalidDataException("Invalid type file 😱"));
      }
      fs.mkdirSync(folderPath, { recursive: true });
      callback(null, folderPath);
    },
    filename: (req, file, callback) => {
      const {
        user: { _id },
      } = req;
      let filename = null;
      switch (file.fieldname) {
        case "identification":
          filename = `${_id}_identification`;
          break;
        case "proofOfAddress":
          filename = `${_id}_proofOfAdress`;
          break;
        case "bankStatement":
          filename = `${_id}_bankStatement`;
          break;
        default:
          filename = `${_id}_${file.originalname}`;
      }
      callback(null, filename);
    },
  });

  // Devuelve el middleware de Multer configurado
  return multer({ storage });
};
