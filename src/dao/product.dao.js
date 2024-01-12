import ProductModel from "./models/product.model.js";

export default class ProductDaoMongoDB {
  static getPaginate(criteria, options) {
    return ProductModel.paginate(criteria, options);
  }

  static getAll(criteria = {}) {
    return ProductModel.find(criteria);
  }

  static getFilter(criteria = {}) {
    return ProductModel.find(criteria);
  }

  static create(data) {
    return ProductModel.create(data);
  }

  static updateById(uid, data) {
    return ProductModel.updateOne({ _id: uid }, { $set: data });
  }

  static deleteById(uid) {
    return ProductModel.deleteOne({ _id: uid });
  }
}
