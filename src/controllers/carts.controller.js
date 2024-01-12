import CartModel from "../dao/models/cart.model.js";
import { NotFoundException } from "../utils.js";

export default class CartsController {
  static get(criteria, options) {
    return CartModel.paginate(criteria, options);
  }

  static async getById(sid) {
    const cart = await CartModel.findById(sid);
    if (!cart) {
      throw new NotFoundException(`Cart with ${sid} not found`);
    }
    return cart;
  }

  static create(data) {
    if (data.length != 0)
      throw new InvalidDataException("El arreglo debe ser vacío");

    return CartModel.create({ products: data });
  }

  static async updateById(sid, data) {
    const cart = await CartsManager.getById(sid);
    if (!cart) throw new NotFoundException(`Cart with ${sid} not found`);
    await CartModel.updateOne({ _id: sid }, { $set: { products: data } });
    console.log(`Cart actualizado correctamente (${sid}) 😁.`);
  }

  static async deleteById(sid) {
    const cart = await CartsManager.getById(sid);
    if (!cart) throw new NotFoundException(`Cart with ${sid} not found`);
    await CartModel.deleteOne({ _id: sid });
    console.log(`Cart eliminado correctamente (${sid}) 🤔.`);
  }
}
