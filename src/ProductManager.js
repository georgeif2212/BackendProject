const fs = require("fs");

class ProductManager {
  #priceBase = 0.15;
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    const products = await getJsonFromFile(this.path);
    return products;
  }

  async addProduct(data) {
    const {
      title,
      description,
      price,
      thumbnail = "Sin imagen",
      code,
      stock,
    } = data;

    let products;

    if (!fs.existsSync(this.path)) {
      products = [];
    } else {
      products = await getJsonFromFile(this.path);
    }

    let product = products.find((product) => product.code === code);

    if (!product) {
      const newProduct = {
        id: products.length + 1,
        title,
        description,
        price: price + this.#priceBase * price,
        thumbnail,
        code,
        stock,
      };
      products.push(newProduct);
      await saveJsonInFile(this.path, products);
      console.log("Product added");
    } else {
      console.error("ERROR: Product already registered");
    }
  }

  async getProductById(id) {
    const products = await getJsonFromFile(this.path);

    let product = products.find((product) => product.id === id);
    if (product) {
      console.log("\tProduct found!\n", product);
    } else console.error(`ERROR: Product with ID: ${id} not found:`);
  }

  async updateProduct(id, data) {
    const { title, description, price, stock } = data;
    const products = await getJsonFromFile(this.path);
    const position = products.findIndex((product) => product.id === id);
    if (position === -1) {
      throw new Error(`ERROR: Product with ID: ${id} not found:`);
    }
    if (title) {
      products[position].title = title;
    }
    if (description) {
      products[position].description = description;
    }
    if (price) {
      products[position].price = price;
    }
    if (stock) {
      products[position].stock = stock;
    }
    await saveJsonInFile(this.path, products);
    console.log("Product updated");
  }

  async deleteProductById(id) {
    let products = await getJsonFromFile(this.path);
    const productIndex = products.findIndex((product) => product.id === id);

    if (productIndex !== -1) {
      products.splice(productIndex, 1);
      await saveJsonInFile(this.path, products);
      console.log(`Product with ID ${id} has been deleted`);
    } else {
      console.error(`ERROR: Product with ID ${id} not found`);
    }
  }
}

const getJsonFromFile = async (path) => {
  if (!fs.existsSync(path)) return [];
  const content = await fs.promises.readFile(path, "utf-8");
  return JSON.parse(content);
};

const saveJsonInFile = (path, data) => {
  const content = JSON.stringify(data, null, "\t");
  return fs.promises.writeFile(path, content, "utf-8");
};

async function test() {
  const productManager = new ProductManager("Products.json");
  const data = {
    title: "Producto prueba 1",
    description: "Este es un producto prueba 1",
    price: 2543,
    thumbnail: "tres imagenes",
    code: "prueba",
    stock: 5,
  };

  const updateData = {
    title: "Esto es para actualizar el producto 1 por su id",
    description: "Este es un producto actualizado 1",
    price: 2543,
    thumbnail: "fdsgfdsf",
    code: "prueba",
    stock: 5,
  };
  await productManager.addProduct(data);
  await productManager.getProductById(2);
  await productManager.updateProduct(1, updateData);
  console.log(await productManager.getProducts());
  await productManager.deleteProductById(1);
  console.log(await productManager.getProducts());
}


module.exports = ProductManager;