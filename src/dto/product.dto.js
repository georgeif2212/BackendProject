export default class ProductDTO {
  constructor(product) {
    this._id = product._id;
    this.title = product.title;
    this.description = product.description;
    this.price = product.price;
    this.thumbnail = product.thumbnail;
    this.code = product.code;
    this.stock = product.stock;
    this.category = product.category;
    this.owner = this.mapOwner(product.owner);
  }

  mapOwner(owner) {
    if (!owner) return null;

    const { first_name, last_name, email } = owner;
    return { first_name, last_name, email };
  }
}
