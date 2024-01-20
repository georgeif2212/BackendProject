import UsersService from "../services/users.service.js";
import {
  InvalidDataException,
  NotFoundException,
  UnauthorizedException,
  createHash,
  isValidPassword,
} from "../utils.js";
import CartsController from "./carts.controller.js";
export default class UsersController {
  static get(criteria, options) {
    return UsersService.getPaginate(criteria, options);
  }

  static async login(data) {
    const { email, password } = data;
    if (!email || !password) {
      throw new InvalidDataException(`Todos los campos son requeridos`);
    }

    const user = await UsersService.getByEmail(email);
    if (!user) {
      throw new UnauthorizedException(`Correo o contraseña invalidos`);
    }

    if (!isValidPassword(password, user)) {
      throw new UnauthorizedException(`Correo o contraseña invalidos`);
    }
    return user;
  }

  static async getById(id) {
    const user = await UsersService.getById(id);
    if (!user) {
      throw new NotFoundException(`user with ${id} not found`);
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
      const missingFieldsString = missingFields.join(", ");
      throw new InvalidDataException(
        `Los campos: ${missingFieldsString} son requeridos`
      );
    }
    const user = await UsersService.getByEmail(email);
    if (user) {
      throw new UnauthorizedException(
        `Ya existe un usuario con el correo ${email} en el sistema.`
      );
    }
    data.password = createHash(password);
    const products = [];
    const newCart = await CartsController.create(products);
    data.cartId = newCart;
    return UsersService.create(data);
  }

  static async updateById(uid, data) {
    const user = await UsersController.getById(uid);
    if (!user) throw new NotFoundException(`user with ${uid} not found`);

    await UsersService.updateById(uid, data);
    console.log(`User actualizado correctamente (${uid}) 😁.`);
  }

  static async deleteById(uid) {
    const user = await UsersController.getById(uid);
    if (!user) throw new NotFoundException(`user with ${uid} not found`);

    await UsersService.deleteById(uid);
    console.log(`User eliminado correctamente (${uid}) 🤔.`);
  }

  static async recoverPassword(data) {
    const { email, password } = data;
    if (!email || !password) {
      throw new InvalidDataException(`Todos los campos son requeridos`);
    }

    const user = await UsersService.getByEmail(email);
    if (!user) {
      throw new InvalidDataException(
        `Correo o contraseña invalidos ${user.email}`
      );
    }
    user.password = createHash(password);
    await UsersService.updateById(user._id, user);
  }
}
