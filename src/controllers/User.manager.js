import UserModel from "./models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import CartsManager from "./Carts.manager.js";
export default class UserManager {
  static get(criteria, options) {
    return UserModel.paginate(criteria, options);
  }

  static async login(data) {
    const { email, password } = data;
    if (!email || !password) {
      throw new Error(`Todos los campos son requeridos`);
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error(`Correo o contraseña invalidos`);
    }

    if (!isValidPassword(password, user)) {
      throw new Error(`Correo o contraseña invalidos`);
    }
    return user;
  }

  static async getById(sid) {
    const user = await UserModel.findById(sid);
    if (!user) {
      throw new Error(`user with ${sid} not found`);
    }
    return user;
  }
  static alreadyExists(email) {
    return UserModel.findOne({ email });
  }

  static async register(data) {
    const { email, password } = data;
    const requiredFields = ["first_name", "email"];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      const missingFieldsString = missingFields.join(", ");
      throw new Error(`Los campos: ${missingFieldsString} son requeridos`);
    }
    const user = await UserModel.findOne({ email });
    if (user) {
      throw new Error(
        `Ya existe un usuario con el correo ${email} en el sistema.`
      );
    }
    data.password = createHash(password);
    const products = [];
    const newCart = await CartsManager.create(products);
    data.cartId=newCart;
    return UserModel.create(data);
  }

  static async updateById(sid, data) {
    const user = await UserManager.getById(sid);
    if (!user) throw new Error(`user with ${sid} not found`);

    await UserModel.updateOne({ _id: sid }, { $set: data });
    console.log(`User actualizado correctamente (${sid}) 😁.`);
  }

  static async deleteById(sid) {
    const user = await UserManager.getById(sid);
    if (!user) throw new Error(`user with ${sid} not found`);

    await UserModel.deleteOne({ _id: sid });
    console.log(`User eliminado correctamente (${sid}) 🤔.`);
  }

  static async recoverPassword(data) {
    const { email, password } = data;
    if (!email || !password) {
      throw new Error(`Todos los campos son requeridos`);
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error(`Correo o contraseña invalidos ${user.email}`);
    }

    user.password = createHash(password);
    await UserModel.updateOne({ email }, user);
  }
}
