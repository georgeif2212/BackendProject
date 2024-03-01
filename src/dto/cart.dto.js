import ProductDTO from "./product.dto.js";
export default class CartDTO {
  constructor(cart) {
    this._id = cart._id || cart.id;
    this.products = cart.products.map(
      (product) => new ProductDTO(product.product)
    );
  }
}
