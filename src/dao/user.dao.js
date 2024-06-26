import UserModel from "./models/user.model.js";

export default class UserDaoMongoDB {
  static getPaginate(criteria, options) {
    return UserModel.paginate(criteria, options);
  }

  static getAll(criteria = {}) {
    return UserModel.find(criteria);
  }

  static getFilter(criteria = {}) {
    return UserModel.find(criteria);
  }

  static create(data) {
    return UserModel.create(data);
  }

  static updateById(uid, data) {
    return UserModel.updateOne({ _id: uid }, { $set: data });
  }

  static deleteById(uid) {
    return UserModel.deleteOne({ _id: uid });
  }
}
