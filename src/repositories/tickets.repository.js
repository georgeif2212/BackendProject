import TicketDto from "../dto/ticket.dto.js";
import TicketDaoMongoDB from "../dao/ticket.dao.js";

export default class TicketsRepository {
  static async getPaginate(filter = {}, opts = {}) {
    const paginatedTickets = await TicketDaoMongoDB.getPaginate(filter, opts);
    const tickets = paginatedTickets.docs.map(
      (ticket) => new TicketDto(ticket)
    );

    const paginatedProTickets = {
      tickets,
      totalDocs: paginatedTickets.totalDocs,
      limit: paginatedTickets.limit,
      totalPages: paginatedTickets.totalPages,
      page: paginatedTickets.page,
      pagingCounter: paginatedTickets.pagingCounter,
      hasPrevPage: paginatedTickets.hasPrevPage,
      hasNextPage: paginatedTickets.hasNextPage,
      prevPage: paginatedTickets.prevPage,
      nextPage: paginatedTickets.nextPage,
    };
    return paginatedProTickets;
  }

  static async getAll(filter = {}) {
    const tickets = await TicketDaoMongoDB.getAll(filter);
    return tickets.map((ticket) => new TicketDto(ticket));
  }

  static async getById(uid) {
    let ticket = await TicketDaoMongoDB.getFilter({ _id: uid });
    if (ticket.length !== 0) {
      ticket = new TicketDto(ticket[0]);
      return ticket;
    }
    return null;
  }

  static async create(data) {
    const ticket = await TicketDaoMongoDB.create(data);
    return new TicketDto(ticket);
  }

  static updateById(uid, data) {
    return TicketDaoMongoDB.updateById(uid, data);
  }

  static deleteById(uid) {
    return TicketDaoMongoDB.deleteById(uid);
  }

  static async getByCode(code) {
    let ticket = await TicketDaoMongoDB.getFilter({ code: code });
    if (ticket.length !== 0) {
      ticket = new TicketDto(ticket[0]);
      return ticket;
    }
    return null;
  }
}
