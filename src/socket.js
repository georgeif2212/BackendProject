import { Server } from "socket.io";
// import ProductManager from "./dao/ProductManagerFS.js";
import ProductsManager from "./dao/Products.manager.js";
import { __dirname } from "./utils.js";

let socketServer;
export const init = async (httpServer) => {
  socketServer = new Server(httpServer);
  // * socketServer.on Permite configurar eventos que queremos escuchar
  // * socketClient es el client que se conecta
  socketServer.on("connection", async (socketClient) => {
    console.log(`Nuevo cliente socket conectado ${socketClient.id} 🎊`);
    const products = await ProductsManager.get();
    socketClient.emit("update-list-products", { products: products });

    socketClient.on("new-product", async (productData) => {
      await ProductsManager.create(productData);
      const newProducts = await ProductsManager.get();
      socketServer.emit("update-list-products", { products: newProducts });
    });

    socketClient.on("delete-product", async (idProduct) => {
      await ProductsManager.deleteById(idProduct);
      const newProducts = await ProductsManager.get();
      socketServer.emit("update-list-products", { products: newProducts });
    });
  });
};

export const emit = (event, data) => {
  socketServer.emit(event, data);
};
