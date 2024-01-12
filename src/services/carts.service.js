import CartDao from "../dao/cart.dao.js";

export default class CartsService {
  static getPaginate(criteria, options) {
    return CartDao.getPaginate(criteria, options);
  }

  static create(data) {
    return CartDao.create(data);
  }

  static async getById(id) {
    const result = await CartDao.getFilter({ _id: id });
    return result[0];
  }

  static updateById(id, data) {
    return CartDao.updateById(id, data);
  }

  static deleteById(id) {
    return CartDao.deleteById(id);
  }

  static async getByEmail(email) {
    const result = await CartDao.getFilter({ email: email });
    return result[0];
  }
}
