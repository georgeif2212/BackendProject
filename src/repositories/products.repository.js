import ProductDto from "../dto/product.dto.js";
import ProductDaoMongoDB from "../dao/product.dao.js";

export default class ProductsRepository {
  static async getPaginate(filter = {}, opts = {}) {
    const products = await ProductDaoMongoDB.getPaginate(filter, opts);
    return products.map((product) => new ProductDto(product));
  }

  static async getAll(filter = {}) {
    const products = await ProductDaoMongoDB.getAll(filter);
    return products.map((product) => new ProductDto(product));
  }

  static async getById(uid) {
    let product = await ProductDaoMongoDB.getFilter({ _id: uid });
    if (product.length !== 0) {
      product = new ProductDto(product[0]);
      return product;
    }
    return null;
  }

  static async create(data) {
    const product = await ProductDaoMongoDB.create(data);
    return new ProductDto(product);
  }

  static updateById(uid, data) {
    return ProductDaoMongoDB.updateById(uid, data);
  }

  static deleteById(uid) {
    return ProductDaoMongoDB.deleteById(uid);
  }

  static async getByCode(code) {
    let product = await ProductDaoMongoDB.getFilter({ code: code });
    if (product.length !== 0) {
      product = new ProductDto(product[0]);
      return product;
    }
    return null;
  }
}
