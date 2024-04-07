import ProductDTO from "./product.dto.js";

export default class CartDTO {
  constructor(cart) {
    this._id = cart._id || cart.id;
    this.products =
      cart.products.map((product) => {
        const productDTO = new ProductDTO(product.product);
        return { product: productDTO, quantity: product.quantity };
      }) || [];
  }
}
