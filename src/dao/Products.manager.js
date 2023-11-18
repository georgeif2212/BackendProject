import ProductModel from "./models/product.model.js";

export default class ProductsManager {
  static get(limit) {
    if (!limit) return ProductModel.find();
    return ProductModel.find().limit(limit);
  }

  static async getById(sid) {
    const product = await ProductModel.findById(sid);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }
  static getByCode(code) {
    return ProductModel.findOne({ code: code });
  }

  static create(data) {
    const { title, description, price, thumbnail, code, stock } = data;
    const missingFields = [];
    if (!title) {
      missingFields.push("title");
    }
    if (!description) {
      missingFields.push("description");
    }
    if (!price) {
      missingFields.push("price");
    }
    if (!thumbnail) {
      missingFields.push("thumbnail");
    }
    if (!code) {
      missingFields.push("code");
    }
    if (!stock) {
      missingFields.push("stock");
    }

    if (missingFields.length > 0) {
      const missingFieldsString = missingFields.join(", ");
      throw new Error(`Data missing: ${missingFieldsString}`);
    }

    return ProductModel.create(data);
  }

  static async updateById(sid, data) {
    await ProductModel.updateOne({ _id: sid }, { $set: data });
    console.log(`Producto actualizado correctamente (${sid}) 😁.`);
  }

  static async deleteById(sid) {
    await ProductModel.deleteOne({ _id: sid });
    console.log(`Producto eliminado correctamente (${sid}) 🤔.`);
  }
}
