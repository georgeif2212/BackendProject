import { InvalidDataException, NotFoundException } from "../utils.js";
import TicketsService from "../services/tickets.service.js";
import { v4 as uuidv4 } from "uuid";
export default class TicketsController {
  static get(criteria, options) {
    return TicketsService.getPaginate(criteria, options);
  }

  static getAll() {
    return TicketsService.getAll({});
  }

  static async getById(tid) {
    const ticket = await TicketsService.getById(tid);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ${tid} not found`);
    }
    return ticket;
  }

  static create(data) {
    const { email, availableProducts } = data;
    if (!email || availableProducts.length == 0)
      throw new InvalidDataException(
        "There must be a buyer and products in the cart"
      );
    const amount = availableProducts.reduce((accumulator, element) => {
      return accumulator + element.product.price * element.quantity;
    }, 0);
    const code = uuidv4();
    const ticketInfo = {
      code,
      amount,
      purchaser: email,
    };

    return TicketsService.create(ticketInfo);
  }

  static async updateById(tid, data) {
    const ticket = await TicketsController.getById(tid);
    if (!ticket) throw new NotFoundException(`ticket with ${tid} not found`);

    await TicketsService.updateById(tid, data);
    console.log(`ticket actualizado correctamente (${tid}) 😁.`);
  }

  static async deleteById(tid) {
    const ticket = await TicketsController.getById(tid);
    if (!ticket) throw new NotFoundException(`ticket with ${tid} not found`);

    await TicketsService.deleteById(tid);
    console.log(`ticket eliminado correctamente (${tid}) 🤔.`);
  }

  static async getByEmail(email) {
    return TicketsService.getByEmail(email);
  }
}
