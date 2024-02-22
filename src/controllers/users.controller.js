import UsersService from "../services/users.service.js";
import {
  createHash,
  isValidPassword,
  sendRecoverPasswordEmail,
  validateToken,
} from "../utils/utils.js";
import {
  generatorAdminPremiumError,
  generatorUserAlreadyExistsError,
  generatorUserError,
  generatorUserIdError,
  generatorUserLoginDataError,
  generatorUserLoginError,
} from "../utils/CauseMessageError.js";
import { CustomError } from "../utils/CustomError.js";
import EnumsError from "../utils/EnumsError.js";
import CartsController from "./carts.controller.js";
export default class UsersController {
  static get(criteria, options) {
    return UsersService.getPaginate(criteria, options);
  }

  static async login(data) {
    const { email, password } = data;
    if (!email || !password) {
      CustomError.create({
        name: "Invalid user data",
        cause: generatorUserLoginError(data),
        message: `"There must be an email and password"`,
        code: EnumsError.BAD_REQUEST_ERROR,
      });
    }

    const user = await UsersService.getByEmail(email);
    if (!user) {
      CustomError.create({
        name: "Invalid user data",
        cause: generatorUserLoginDataError(),
        message: `Correo o contraseña inválidos`,
        code: EnumsError.UNAUTHORIZED_ERROR,
      });
    }

    if (!isValidPassword(password, user)) {
      CustomError.create({
        name: "Invalid user data",
        cause: generatorUserLoginDataError(),
        message: `Correo o contraseña inválidos`,
        code: EnumsError.UNAUTHORIZED_ERROR,
      });
    }
    return user;
  }

  static async getById(id) {
    const user = await UsersService.getById(id);
    if (!user) {
      CustomError.create({
        name: "User not found",
        cause: generatorUserIdError(id),
        message: `User with ${id} not found`,
        code: EnumsError.NOT_FOUND_ERROR,
      });
    }
    return user;
  }

  static alreadyExists(email) {
    return UsersService.getByEmail(email);
  }

  static async register(data) {
    const { email, password } = data;
    const requiredFields = ["first_name", "email"];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return CustomError.create({
        name: "Invalid user data",
        cause: generatorUserError(data),
        message: `Correo o contraseña inválidos`,
        code: EnumsError.UNAUTHORIZED_ERROR,
      });
    }
    const user = await UsersService.getByEmail(email);
    if (user) {
      CustomError.create({
        name: "User already exists",
        cause: generatorUserAlreadyExistsError(data),
        message: `User already exists`,
        code: EnumsError.CONFLICT,
      });
    }
    data.password = createHash(password);
    const products = [];
    const newCart = await CartsController.create(products);
    data.cartId = newCart;
    return UsersService.create(data);
  }

  static async updateById(uid, data) {
    const user = await UsersController.getById(uid);
    return UsersService.updateById(user._id, data);
  }

  static async deleteById(uid) {
    const user = await UsersController.getById(uid);
    return UsersService.deleteById(user._id);
  }

  static async recoverPasswordbyEmail(data) {
    const { email } = data;
    if (!email) {
      CustomError.create({
        name: "Invalid user data",
        cause: generatorUserLoginError(data),
        message: `"There must be an email "`,
        code: EnumsError.BAD_REQUEST_ERROR,
      });
    }
    const user = await UsersService.getByEmail(email);
    if (!user) {
      return null;
    }
    sendRecoverPasswordEmail(user);
  }

  static async createNewPassword(data) {
    let { password, token } = data;
    const payload = await validateToken(token);
    const user = await UsersService.getByEmail(payload.email);

    if (isValidPassword(password, user)) {
      CustomError.create({
        name: "Invalid user data",
        cause: generatorUserLoginDataError(),
        message: `The password is the same`,
        code: EnumsError.BAD_REQUEST_ERROR,
      });
    }
    password = createHash(password);
    user.password = password;
    UsersController.updateById(user._id, user);
  }

  static async premiumOrNotUser(data) {
    const user = await UsersController.getById(data.uid);

    if (user.role === "admin") {
      CustomError.create({
        name: "Invalid admin change",
        cause: generatorAdminPremiumError(),
        message: `The admin can't be changed to premium user`,
        code: EnumsError.BAD_REQUEST_ERROR,
      });
    }
    user.role = user.role == "user" ? "premium" : "user";
    UsersController.updateById(user._id, user);
  }
}
