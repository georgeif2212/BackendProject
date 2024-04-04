import TicketsService from "../services/tickets.service.js";
import { v4 as uuidv4 } from "uuid";
import {
  generatorTicketError,
  generatorTicketIdError,
} from "../utils/CauseMessageError.js";
import { CustomError } from "../utils/CustomError.js";
import PaymentsService from "../services/payments.service.js";
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
      CustomError.create({
        name: "Ticket not found",
        cause: generatorTicketIdError(tid),
        message: `Ticket with ${cid} not found`,
        code: EnumsError.NOT_FOUND_ERROR,
      });
    }
    return ticket;
  }

  static async create(data) {
    const { user, availableProducts } = data;
    if (!user.email || availableProducts.length == 0) {
      CustomError.create({
        name: "Invalid ticket data",
        cause: generatorTicketError(data),
        message: `"There must be an email and available products"`,
        code: EnumsError.BAD_REQUEST_ERROR,
      });
    }
    const amount = availableProducts.reduce((accumulator, element) => {
      return accumulator + element.product.price * element.quantity;
    }, 0);
    const code = uuidv4();
    const ticketInfo = {
      code,
      amount,
      purchaser: user.email,
    };

    return TicketsService.create(ticketInfo);
  }

  static async updateById(tid, data) {
    const ticket = await TicketsController.getById(tid);
    await TicketsService.updateById(ticket._id, data);
  }

  static async deleteById(tid) {
    const ticket = await TicketsController.getById(tid);
    await TicketsService.deleteById(ticket._id);
  }

  static async getByEmail(email) {
    return TicketsService.getByEmail(email);
  }
}
