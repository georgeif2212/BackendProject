import { InvalidDataException, NotFoundException } from "../utils.js";
import ChatsService from "../services/chats.service.js";

export default class ChatsController {
  static get(limit) {
    return ChatsService.get(limit);
  }

  static async getById(cid) {
    const message = await ChatsService.getById(cid);
    if (!message) throw new NotFoundException(`Cart with ${cid} not found`);

    return message;
  }

  static create(data) {
    const { user, message } = data;
    if (!user || !message)
      throw new InvalidDataException("Usuario y mensaje requeridos");
    return ChatsService.create(data);
  }

  // static async updateById(cid, data) {
  //   const message = await ChatsController.getById(cid);
  //   if (!message) throw new NotFoundException(`Message with ${cid} not found`);
  //   await ChatsService.updateOne({ _id: cid }, { $set: { products: data } });
  //   console.log(`Producto actualizado correctamente (${cid}) 😁.`);
  // }

  static async deleteById(cid) {
    const message = await ChatsController.getById(cid);
    if (!message) throw new NotFoundException(`Message with ${cid} not found`);

    await ChatsService.deleteById(cid);
    console.log(`Message eliminado correctamente (${cid}) 🤔.`);
  }
}
