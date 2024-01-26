import { InvalidDataException, NotFoundException } from "../utils.js";
import ProductsService from "../services/products.service.js";
import { generatorProductError, generatorProductIdError } from "../utils/CauseMessageError.js";
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
    console.log(`Producto actualizado correctamente (${pid}) 😁.`);
  }

  static async deleteById(pid) {
    const product = await ProductsController.getById(pid);
    await ProductsService.deleteById(product._id);
    console.log(`Producto eliminado correctamente (${pid}) 🤔.`);
  }
}
