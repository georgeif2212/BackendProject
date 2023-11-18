import ProductModel from "./models/product.model.js";

export default class ProductsManager {
  static get(limit) {
    if (!limit) return ProductModel.find();
    return ProductModel.find().limit(limit);
  }

  static async getById(sid) {
    const product = await ProductModel.findById(sid);
    if (!product) {
      throw new Error(`Product with ${sid} not found`);
    }
    return product;
  }
  static alreadyExists(code) {
    return ProductModel.findOne({ code: code });
  }

  static create(data) {
    const { title, description, price, thumbnail, code, stock } = data;

    const requiredFields = [
      "title",
      "description",
      "price",
      "thumbnail",
      "code",
      "stock",
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      const missingFieldsString = missingFields.join(", ");
      throw new Error(`Data missing: ${missingFieldsString}`);
    }
    return ProductModel.create(data);
  }

  static async updateById(sid, data) {
    const product = await ProductsManager.getById(sid);
    if (!product) throw new Error(`Product with ${sid} not found`);
    
    await ProductModel.updateOne({ _id: sid }, { $set: data });
    console.log(`Producto actualizado correctamente (${sid}) 😁.`);
  }

  static async deleteById(sid) {
    const product = await ProductsManager.getById(sid);
    if (!product) throw new Error(`Product with ${sid} not found`);
    
    await ProductModel.deleteOne({ _id: sid });
    console.log(`Producto eliminado correctamente (${sid}) 🤔.`);
  }
}
