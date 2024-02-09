import CartsService from "../services/carts.service.js";
import {
  generatorCartError,
  generatorCartIdError,
} from "../utils/CauseMessageError.js";
import { CustomError } from "../utils/CustomError.js";
import EnumsError from "../utils/EnumsError.js";
import ProductsController from "./products.controller.js";

export default class CartsController {
  static get(criteria, options) {
    return CartsService.getPaginate(criteria, options);
  }

  static async getById(cid) {
    const cart = await CartsService.getById(cid);
    if (!cart) {
      CustomError.create({
        name: "Cart not found",
        cause: generatorCartIdError(cid),
        message: `Cart with ${cid} not found`,
        code: EnumsError.NOT_FOUND_ERROR,
      });
    }
    return cart;
  }

  static create(data) {
    if (data.length != 0) {
      CustomError.create({
        name: "Cart can't be created",
        cause: generatorCartError(data),
        message: `Array must be empty`,
        code: EnumsError.BAD_REQUEST_ERROR,
      });
    }
    return CartsService.create(data);
  }

  static async updateById(cid, data) {
    const cart = await CartsController.getById(cid);
    await CartsService.updateById(cart._id, data);
  }

  static async deleteById(cid) {
    const cart = await CartsController.getById(cid);
    await CartsService.deleteById(cart._id);
  }

  static async doPurchase(cid) {
    const cart = await CartsController.getById(cid);
    if (cart.products.length === 0) {
      CustomError.create({
        name: "Empty cart",
        cause: "Empty cart",
        message: `Empty cart`,
        code: EnumsError.BAD_REQUEST_ERROR,
      });
    }

    const availableProducts = cart.products.filter((element) => {
      return element.quantity <= element.product.stock;
    });
    const notAvailableProducts = cart.products.filter((element) => {
      return element.quantity > element.product.stock;
    });
    CartsController.updateById(cid, notAvailableProducts);
    availableProducts.forEach((element) => {
      element.product.stock -= element.quantity;
      ProductsController.updateById(element.product._id, element.product);
    });
    return availableProducts;
  }
}
