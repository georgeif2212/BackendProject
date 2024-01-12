import { InvalidDataException, NotFoundException } from "../utils.js";
import MessageModel from "./models/message.model.js";

export default class ChatsController {
  static get(limit) {
    if (!limit) return MessageModel.find();
    return MessageModel.find().limit(limit);
  }

  static async getById(sid) {
    const cart = await MessageModel.findById(sid);
    if (!cart) throw new NotFoundException(`Cart with ${sid} not found`);

    return cart;
  }

  static create(data) {
    const { user, message } = data;
    if (!user || !message)
      throw new InvalidDataException("Usuario y mensaje requeridos");
    return MessageModel.create(data);
  }

  static async updateById(sid, data) {
    const product = await ProductsManager.getById(sid);
    if (!product) throw new NotFoundException(`Product with ${sid} not found`);
    await MessageModel.updateOne({ _id: sid }, { $set: { products: data } });
    console.log(`Producto actualizado correctamente (${sid}) 😁.`);
  }

  static async deleteById(sid) {
    const product = await ProductsManager.getById(sid);
    if (!product) throw new NotFoundException(`Product with ${sid} not found`);

    await MessageModel.deleteOne({ _id: sid });
    console.log(`Producto eliminado correctamente (${sid}) 🤔.`);
  }
}
