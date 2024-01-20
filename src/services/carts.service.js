import CartRepository from "../repositories/carts.repository.js";

export default class CartsService {
  static getPaginate(criteria, options) {
    return CartRepository.getPaginate(criteria, options);
  }

  static create(data) {
    return CartRepository.create(data);
  }

  static getById(id) {
    return CartRepository.getById(id);
  }

  static updateById(id, data) {
    return CartRepository.updateById(id, data);
  }

  static deleteById(id) {
    return CartRepository.deleteById(id);
  }
}
