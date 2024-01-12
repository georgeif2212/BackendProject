import ProductDao from "../dao/product.dao.js";

export default class ProductsService {
  static getPaginate(criteria, options) {
    return ProductDao.getPaginate(criteria, options);
  }

  static getAll(filter = {}) {
    return ProductDao.getAll(filter);
  }

  static create(data) {
    return ProductDao.create(data);
  }

  static async getById(id) {
    const result = await ProductDao.getFilter({ _id: id });
    return result[0];
  }

  static updateById(id, data) {
    return ProductDao.updateById(id, data);
  }

  static deleteById(id) {
    return ProductDao.deleteById(id);
  }

  static async getByCode(code) {
    const result = await ProductDao.getFilter({ code: code });
    return result[0];
  }
}
