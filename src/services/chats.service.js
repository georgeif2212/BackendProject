import ChatDao from "../dao/chat.dao.js";

export default class ChatsService {
  static get(limit) {
    return ChatDao.get(limit);
  }

  static create(data) {
    return ChatDao.create(data);
  }

  static async getById(id) {
    const result = await ChatDao.getFilter({ _id: id });
    return result[0];
  }

  static updateById(id, data) {
    return ChatDao.updateById(id, data);
  }

  static deleteById(id) {
    return ChatDao.deleteById(id);
  }

  static async getByEmail(email) {
    const result = await ChatDao.getFilter({ email: email });
    return result[0];
  }
}
