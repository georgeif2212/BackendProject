import { InvalidDataException, NotFoundException } from "../utils.js";
import TicketsService from "../services/tickets.service.js";

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
    const { title, description, price, thumbnail, code, stock } = data;

    const requiredFields = [
      "title",
      "description",
      "price",
      "thumbnail",
      "code",
      "stock",
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      const missingFieldsString = missingFields.join(", ");
      throw new InvalidDataException(`Data missing: ${missingFieldsString}`);
    }
    return TicketsService.create(data);
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
}
