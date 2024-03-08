import ProductsService from "../services/products.service.js";
import {
  generatorPermissionError,
  generatorProductError,
  generatorProductIdError,
} from "../utils/CauseMessageError.js";
import { CustomError } from "../utils/CustomError.js";
import EnumsError from "../utils/EnumsError.js";

export default class ProductsController {
  static get(criteria, options) {
    return ProductsService.getPaginate(criteria, options);
  }

  static getAll() {
    return ProductsService.getAll({});
  }

  static async getById(pid) {
    const product = await ProductsService.getById(pid);
    if (!product) {
      CustomError.create({
        name: "Product not found",
        cause: generatorProductIdError(pid),
        message: `Product with ${pid} not found`,
        code: EnumsError.NOT_FOUND_ERROR,
      });
    }
    return product;
  }

  static alreadyExists(code) {
    return ProductsService.getByCode(code);
  }

  static create(data) {
    const { title, description, price, thumbnail, code, stock } = data;

    const requiredFields = [
      "title",
      "description",
      "price",
      "thumbnail",
      "code",
      "stock",
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      CustomError.create({
        name: "Invalid data product",
        cause: generatorProductError(data),
        message: `Array must be empty`,
        code: EnumsError.BAD_REQUEST_ERROR,
      });
    }
    return ProductsService.create(data);
  }

  static async updateById(pid, data) {
    const product = await ProductsController.getById(pid);
    await ProductsService.updateById(product._id, data);
  }

  static async deleteById(pid, user) {
    const product = await ProductsController.getById(pid);
    if (user.role === "admin") {
      return ProductsService.deleteById(product._id);
    }
    if (user.role === "premium" && product.owner.email === user.email) {
      return ProductsService.deleteById(product._id);
    }

    if (product.owner.email === user.email) {
      return ProductsService.deleteById(product._id);
    }

    // Si no es admin ni propietario, lanza error de permiso
    CustomError.create({
      name: "Invalid permission",
      cause: generatorPermissionError(),
      message:
        "Unauthorized: User without permission or product belongs to someone else",
      code: EnumsError.UNAUTHORIZED_ERROR,
    });
  }
}
