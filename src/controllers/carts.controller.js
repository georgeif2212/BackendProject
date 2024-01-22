import CartsService from "../services/carts.service.js";
import {
  InsufficientStockException,
  InvalidDataException,
  NotFoundException,
} from "../utils.js";
import ProductsController from "./products.controller.js";

export default class CartsController {
  static get(criteria, options) {
    return CartsService.getPaginate(criteria, options);
  }

  static async getById(cid) {
    const cart = await CartsService.getById(cid);
    if (!cart) {
      throw new NotFoundException(`Cart with ${cid} not found`);
    }
    return cart;
  }

  static create(data) {
    if (data.length != 0)
      throw new InvalidDataException("El arreglo debe ser vacío");

    return CartsService.create(data);
  }

  static async updateById(cid, data) {
    const cart = await CartsController.getById(cid);
    if (!cart) throw new NotFoundException(`Cart with ${cid} not found`);
    await CartsService.updateById(cid, data);
    console.log(`Cart actualizado correctamente (${cid}) 😁.`);
  }

  static async deleteById(cid) {
    const cart = await CartsController.getById(cid);
    if (!cart) throw new NotFoundException(`Cart with ${cid} not found`);
    await CartsService.deleteById(cid);
    console.log(`Cart eliminado correctamente (${cid}) 🤔.`);
  }

  static async doPurchase(cid) {
    const cart = await CartsController.getById(cid);
    if (cart.products.length === 0)
      throw new InvalidDataException("No tienes elementos en el carrito");

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
