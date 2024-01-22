import TicketsRepository from "../repositories/tickets.repository.js";

export default class TicketsService {
  static getPaginate(criteria, options) {
    return TicketsRepository.getPaginate(criteria, options);
  }

  static getAll(filter = {}) {
    return TicketsRepository.getAll(filter);
  }

  static create(data) {
    return TicketsRepository.create(data);
  }

  static async getById(id) {
    const result = await TicketsRepository.getById(id);
    return result;
  }

  static updateById(id, data) {
    return TicketsRepository.updateById(id, data);
  }

  static deleteById(id) {
    return TicketsRepository.deleteById(id);
  }

  static async getByCode(code) {
    const result = await TicketsRepository.getByCode(code);
    return result;
  }
}
