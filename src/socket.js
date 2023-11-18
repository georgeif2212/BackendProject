import { Server } from "socket.io";
import ProductManager from "./dao/ProductManagerFS.js";
import { __dirname } from "./utils.js";
import path from "path";

const productManager = new ProductManager(
  path.join(__dirname, "../Products.json")
);

const products = await productManager.getProducts();

let socketServer;
export const init = (httpServer) => {
  socketServer = new Server(httpServer);
  // * socketServer.on Permite configurar eventos que queremos escuchar
  // * socketClient es el client que se conecta
  socketServer.on("connection", (socketClient) => {
    console.log(`Nuevo cliente socket conectado ${socketClient.id} 🎊`);

    socketClient.emit("update-list-products", { products });

    socketClient.on("new-product", async (productData) => {
      productManager.addProduct(productData);
      const newProducts = await productManager.getProducts();
      socketServer.emit("update-list-products", { newProducts });
    });

    socketClient.on("delete-product", (idProduct) => {
      productManager.deleteProductById(idProduct);
      socketServer.emit("update-list-products", { products });
    });
  });
};

export const emit = (event, data) => {
  socketServer.emit(event, data);
};
