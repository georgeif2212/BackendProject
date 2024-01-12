import CartsService from "../services/carts.service.js";
import { NotFoundException } from "../utils.js";

export default class CartsController {
  static get(criteria, options) {
    return CartsService.getPaginate(criteria, options);
  }

  static async getById(cid) {
    const cart = await CartsService.getById(cid);
    if (!cart) {
      throw new NotFoundException(`Cart with ${cid} not found`);
    }
    return cart;
  }

  static create(data) {
    if (data.length != 0)
      throw new InvalidDataException("El arreglo debe ser vacío");

    return CartsService.create(data);
  }

  static async updateById(cid, data) {
    const cart = await CartsController.getById(cid);
    if (!cart) throw new NotFoundException(`Cart with ${cid} not found`);
    await CartsService.updateById(cid, data);
    console.log(`Cart actualizado correctamente (${cid}) 😁.`);
  }

  static async deleteById(cid) {
    const cart = await CartsController.getById(cid);
    if (!cart) throw new NotFoundException(`Cart with ${cid} not found`);
    await CartsService.deleteById(cid);
    console.log(`Cart eliminado correctamente (${cid}) 🤔.`);
  }
}
