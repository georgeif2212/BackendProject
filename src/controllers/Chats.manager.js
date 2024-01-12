import MessageModel from "./models/message.model.js";

export default class ChatsManager {
  static get(limit) {
    if (!limit) return MessageModel.find();
    return MessageModel.find().limit(limit);
  }

  static async getById(sid) {
    const cart = await MessageModel.findById(sid);
    if (!cart) {
      throw new Error(`Cart with ${sid} not found`);
    }
    return cart;
  }

  static create(data) {
    const { user, message } = data;

    return MessageModel.create(data);
  }

  static async updateById(sid, data) {
    const product = await ProductsManager.getById(sid);
    if (!product) throw new Error(`Product with ${sid} not found`);
    await MessageModel.updateOne({ _id: sid }, { $set: { products: data } });
    console.log(`Producto actualizado correctamente (${sid}) 😁.`);
  }

  static async deleteById(sid) {
    const product = await ProductsManager.getById(sid);
    if (!product) throw new Error(`Product with ${sid} not found`);

    await MessageModel.deleteOne({ _id: sid });
    console.log(`Producto eliminado correctamente (${sid}) 🤔.`);
  }
}
