import UserRepository from "../repositories/users.repository.js";
export default class UsersService {
  static getPaginate(criteria, options) {
    return UserRepository.getPaginate(criteria, options);
  }

  static create(data) {
    return UserRepository.create(data);
  }

  static async getById(id) {
    const result = await UserRepository.getById(id);
    return result[0];
  }

  static updateById(id, data) {
    return UserRepository.updateById(id, data);
  }

  static deleteById(id) {
    return UserRepository.deleteById(id);
  }

  static async getByEmail(email) {
    const result = await UserRepository.getByEmail(email);
    return result[0];
  }
}
