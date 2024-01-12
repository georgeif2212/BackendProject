import { InvalidDataException, NotFoundException } from "../utils.js";
import ProductsService from "../services/products.service.js";

export default class ProductsController {
  static get(criteria, options) {
    return ProductsService.getPaginate(criteria, options);
  }

  static async getById(pid) {
    const product = await ProductsService.getById(pid);
    if (!product) {
      throw new NotFoundException(`Product with ${pid} not found`);
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
      const missingFieldsString = missingFields.join(", ");
      throw new InvalidDataException(`Data missing: ${missingFieldsString}`);
    }
    return ProductsService.create(data);
  }

  static async updateById(pid, data) {
    const product = await ProductsController.getById(pid);
    if (!product) throw new NotFoundException(`Product with ${pid} not found`);

    await ProductsService.updateById(pid, data);
    console.log(`Producto actualizado correctamente (${pid}) 😁.`);
  }

  static async deleteById(pid) {
    const product = await ProductsController.getById(pid);
    if (!product) throw new NotFoundException(`Product with ${pid} not found`);

    await ProductsService.deleteById(pid);
    console.log(`Producto eliminado correctamente (${pid}) 🤔.`);
  }
}
