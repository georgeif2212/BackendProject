import UserDto from "../dto/user.dto.js";
import UserDaoMongoDB from "../dao/user.dao.js";

export default class UserRepository {
  static async getPaginate(filter = {}, opts = {}) {
    const paginatedUsers = await UserDaoMongoDB.getPaginate(filter, opts);
    const users = paginatedUsers.docs.map(
      (user) => UserDto.getAllUsers(user)
    );
    return {
      users,
      totalDocs: paginatedUsers.totalDocs,
      limit: paginatedUsers.limit,
      totalPages: paginatedUsers.totalPages,
      page: paginatedUsers.page,
      pagingCounter: paginatedUsers.pagingCounter,
      hasPrevPage: paginatedUsers.hasPrevPage,
      hasNextPage: paginatedUsers.hasNextPage,
      prevPage: paginatedUsers.prevPage,
      nextPage: paginatedUsers.nextPage,
    };
  }

  static async getAll(filter = {}) {
    const users = await UserDaoMongoDB.getAll(filter);
    console.log(users);
    return users.map((user) => new UserDto(user));
  }

  static async getById(uid) {
    let user = await UserDaoMongoDB.getFilter({ _id: uid });
    if (user.length !== 0) {
      user = new UserDto(user[0]);
      return user;
    }
    return null;
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
    if (user.length !== 0) {
      user = new UserDto(user[0]);
      return user;
    }
    return null;
  }
}
