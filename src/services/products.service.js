import ProductsRepository from "../repositories/products.repository.js";

export default class ProductsService {
  static getPaginate(criteria, options) {
    return ProductsRepository.getPaginate(criteria, options);
  }

  static getAll(filter = {}) {
    return ProductsRepository.getAll(filter);
  }

  static create(data) {
    return ProductsRepository.create(data);
  }

  static async getById(id) {
    const result = await ProductsRepository.getById(id);
    return result;
  }

  static updateById(id, data) {
    return ProductsRepository.updateById(id, data);
  }

  static deleteById(id) {
    return ProductsRepository.deleteById(id);
  }

  static async getByCode(code) {
    const result = await ProductsRepository.getByCode(code);
    return result;
  }
}
