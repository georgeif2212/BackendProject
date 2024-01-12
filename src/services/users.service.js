import UserDao from "../dao/user.dao.js";

export default class UsersService {
  static getPaginate(criteria, options) {
    return UserDao.getPaginate(criteria, options);
  }

  static create(data) {
    return UserDao.create(data);
  }

  static async getById(id) {
    const result = await UserDao.getFilter({ _id: id });
    return result[0];
  }

  static updateById(id, data) {
    return UserDao.updateById(id, data);
  }

  static deleteById(id) {
    return UserDao.deleteById(id);
  }

  static async getByEmail(email) {
    const result = await UserDao.getFilter({ email: email });
    return result[0];
  }
}
