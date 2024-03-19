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
      const fileExtension = file.mimetype.split("/");
      switch (file.fieldname) {
        case "identification":
          filename = `${_id}_identification.${fileExtension[1]}`;
          break;
        case "proofOfAddress":
          filename = `${_id}_proofOfAdress.${fileExtension[1]}`;
          break;
        case "bankStatement":
          filename = `${_id}_bankStatement.${fileExtension[1]}`;
          break;
        case "photos":
          filename = `${_id}_${Date.now() / 1000}.${fileExtension[1]}`;
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
