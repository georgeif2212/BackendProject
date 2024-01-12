import MessageModel from "./models/message.model";

export default class ChatDaoMongoDB {
  static get(limit) {
    if (!limit) return MessageModel.find();

    return MessageModel.find().limit(limit);
  }

  static getFilter(criteria = {}) {
    return MessageModel.find(criteria);
  }

  static create(data) {
    return MessageModel.create(data);
  }

  static updateById(cid, data) {
    return MessageModel.updateOne({ _id: cid }, { $set: data });
  }

  static deleteById(cid) {
    return MessageModel.deleteOne({ _id: cid });
  }
}
