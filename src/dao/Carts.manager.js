import CartModel from "./models/cart.model.js";

export default class ProductsManager {
  static get(limit) {
    if (!limit) return CartModel.find();
    return CartModel.find().limit(limit);
  }

  static async getById(sid) {
    const cart = await CartModel.findById(sid);
    if (!cart) {
      throw new Error(`Cart with ${sid} not found`);
    }
    return cart;
  }

  static create(data) {
    const { products } = data;
    if (products.length === 0) throw new Error(`Empty cart, no need to save`);

    return CartModel.create(data);
  }

  static async updateById(sid, data) {
    const product = await ProductsManager.getById(sid);
    if (!product) throw new Error(`Product with ${sid} not found`);
    await CartModel.updateOne({ _id: sid }, { $set: { products: data } });
    console.log(`Producto actualizado correctamente (${sid}) 😁.`);
  }

  static async deleteById(sid) {
    const product = await ProductsManager.getById(sid);
    if (!product) throw new Error(`Product with ${sid} not found`);

    await CartModel.deleteOne({ _id: sid });
    console.log(`Producto eliminado correctamente (${sid}) 🤔.`);
  }
}
