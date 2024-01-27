import { Server } from "socket.io";
// import ProductManager from "./dao/ProductManagerFS.js";
import ProductsController from "./controllers/products.controller.js";
import { __dirname } from "./utils/utils.js";
import ChatsController from "./controllers/chats.controller.js";

let socketServer;
export const init = (httpServer) => {
  socketServer = new Server(httpServer);

  // * socketServer.on Permite configurar eventos que queremos escuchar
  // * socketClient es el client que se conecta
  socketServer.on("connection", async (socketClient) => {
    console.log(`Nuevo cliente socket conectado ${socketClient.id} 🎊`);
    // ! CONFIGURACIÓN PARA LOS PRODUCTOS
    const products = await ProductsController.getAll();
    socketClient.emit("update-list-products", { products: products });

    socketClient.on("new-product", async (productData) => {
      await ProductsController.create(productData);
      const newProducts = await ProductsController.getAll();
      socketServer.emit("update-list-products", { products: newProducts });
    });

    socketClient.on("delete-product", async (idProduct) => {
      await ProductsController.deleteById(idProduct);
      const newProducts = await ProductsController.getAll();
      socketServer.emit("update-list-products", { products: newProducts });
    });

    // ! CONFIGURACIÓN PARA EL CHAT
    const messages = await ChatsController.get();
    socketClient.emit("update-messages", { messages: messages });

    socketClient.on("new-message", async (newMessage) => {
      await ChatsController.create(newMessage);

      const messages = await ChatsController.get();
      socketServer.emit("update-messages", { messages: messages });
    });
  });
};

export const emit = (event, data) => {
  socketServer.emit(event, data);
};
