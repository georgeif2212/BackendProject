import CartDto from "../dto/cart.dto.js";
import CartDaoMongoDB from "../dao/cart.dao.js";

export default class CartRepository {
  static async getPaginate(filter = {}, opts = {}) {
    const paginatedCarts = await CartDaoMongoDB.getPaginate(filter, opts);
    const carts = paginatedCarts.docs.map((cart) => new CartDto(cart));

    const paginatedCartsDTO = {
      carts,
      totalDocs: paginatedCarts.totalDocs,
      limit: paginatedCarts.limit,
      totalPages: paginatedCarts.totalPages,
      page: paginatedCarts.page,
      pagingCounter: paginatedCarts.pagingCounter,
      hasPrevPage: paginatedCarts.hasPrevPage,
      hasNextPage: paginatedCarts.hasNextPage,
      prevPage: paginatedCarts.prevPage,
      nextPage: paginatedCarts.nextPage,
    };

    return paginatedCartsDTO;
  }

  static async getById(cid) {
    let cart = await CartDaoMongoDB.getFilter({ _id: cid });
    if (cart.length !== 0) {
      cart = new CartDto(cart[0]);
      return cart;
    }
    return null;
  }

  static async create(data) {
    const cart = await CartDaoMongoDB.create(data);
    return new CartDto(cart);
  }

  static updateById(cid, data) {
    return CartDaoMongoDB.updateById(cid, data);
  }

  static deleteById(cid) {
    return CartDaoMongoDB.deleteById(cid);
  }

}
