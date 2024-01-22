import TicketModel from "./models/ticket.model.js";

export default class TicketDaoMongoDB {
  static getPaginate(criteria, options) {
    return TicketModel.paginate(criteria, options);
  }

  static getAll(criteria = {}) {
    return TicketModel.find(criteria);
  }

  static getFilter(criteria = {}) {
    return TicketModel.find(criteria);
  }

  static create(data) {
    return TicketModel.create(data);
  }

  static updateById(tid, data) {
    return TicketModel.updateOne({ _id: tid }, { $set: data });
  }

  static deleteById(tid) {
    return TicketModel.deleteOne({ _id: tid });
  }
}
