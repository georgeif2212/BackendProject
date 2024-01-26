export default class TicketDTO {
  constructor(ticket) {
    this._id = ticket._id;
    this.code = ticket.code;
    this.amount = ticket.amount;
    this.purchaser = ticket.purchaser;
    this.purchase_datetime=ticket.createdAt;
  }
}
