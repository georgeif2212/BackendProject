import ChatsService from "../services/chats.service.js";
import { CustomError } from "../utils/CustomError.js";
import {
  generatorMessageError,
  generatorMessageIdError,
} from "../utils/CauseMessageError.js";

export default class ChatsController {
  static get(limit) {
    return ChatsService.get(limit);
  }

  static async getById(cid) {
    const message = await ChatsService.getById(cid);

    if (!message) {
      CustomError.create({
        name: "Message not found",
        cause: generatorMessageIdError(cid),
        message: `Message with ${cid} not found`,
        code: EnumsError.NOT_FOUND_ERROR,
      });
    }
    return message;
  }

  static create(data) {
    const { user, message } = data;
    if (!user || !message)
      CustomError.create({
        name: "Invalid data message",
        cause: generatorMessageError(data),
        message: `An error occurred while creating a message`,
        code: EnumsError.BAD_REQUEST_ERROR,
      });
    return ChatsService.create(data);
  }

  static async deleteById(cid) {
    const message = await ChatsController.getById(cid);
    await ChatsService.deleteById(message._id);
  }
}
