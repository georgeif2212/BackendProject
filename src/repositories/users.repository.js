import UserDto from "../dto/user.dto.js";
import UserDaoMongoDB from "../dao/user.dao.js";

export default class UserRepository {
  static async getPaginate(filter = {}, opts = {}) {
    const users = await UserDaoMongoDB.getPaginate(filter, opts);
    return users.map((user) => new UserDto(user));
  }

  async getById(uid) {
    let user = await UserDaoMongoDB.getFilter({ _id: uid });
    if (user) {
      user = new UserDto(user);
    }
    return user;
  }

  static async create(data) {
    const user = await UserDaoMongoDB.create(data);
    return new UserDto(user);
  }

  static updateById(uid, data) {
    return UserDaoMongoDB.updateById(uid, data);
  }

  static deleteById(uid) {
    return UserDaoMongoDB.deleteById(uid);
  }

  static async getByEmail(email) {
    let user = await UserDaoMongoDB.getFilter({ email: email });
    if (user) {
      user = new UserDto(user);
    }
    return user;
  }
}
