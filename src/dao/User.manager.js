import UserModel from "./models/user.model.js";

export default class UserManager {
  static get(criteria, options) {
    return UserModel.paginate(criteria, options);
  }

  static async login(data) {
    const { email, password } = data;
    if (!email || !password) {
      throw new Error(`Todos los campos son requeridos`);
    }

    const user = await UserModel.findOne({email});
    if (!user) {
      throw new Error(`Correo o contraseña invalidos`);
    }

    if (user.password !== password) {
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
  static alreadyExists(code) {
    return UserModel.findOne({ code: code });
  }

  static register(data) {
    const { first_name, last_name, email, password, age } = data;

    const requiredFields = ["first_name", "last_name", "email", "password"];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      const missingFieldsString = missingFields.join(", ");
      throw new Error(`Data missing: ${missingFieldsString}`);
    }
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
}
