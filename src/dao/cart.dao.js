import CartModel from "./models/cart.model.js";

export default class CartDaoMongoDB {
  static getPaginate(criteria, options) {
    return CartModel.paginate(criteria, options);
  }

  static getFilter(criteria = {}) {
    return CartModel.find(criteria);
  }

  static create(data) {
    return CartModel.create({ products: data });
  }

  static updateById(cid, data) {
    return CartModel.updateOne({ _id: cid }, { $set: { products: data } });
  }

  static deleteById(cid) {
    return CartModel.deleteOne({ _id: cid });
  }
}
