import { Server } from "socket.io";
// import ProductManager from "./dao/ProductManagerFS.js";
import ProductsManager from "./dao/Products.manager.js";
import { __dirname } from "./utils.js";
import ChatsManager from "./dao/Chats.manager.js";

let socketServer;
export const init = (httpServer) => {
  socketServer = new Server(httpServer);

  // * socketServer.on Permite configurar eventos que queremos escuchar
  // * socketClient es el client que se conecta
  socketServer.on("connection", async (socketClient) => {
    console.log(`Nuevo cliente socket conectado ${socketClient.id} 🎊`);
    // ! CONFIGURACIÓN PARA LOS PRODUCTOS
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

    // ! CONFIGURACIÓN PARA EL CHAT
    const messages = await ChatsManager.get();
    socketClient.emit("update-messages", { messages: messages });

    socketClient.on("new-message", async (newMessage) => {
      await ChatsManager.create(newMessage);

      const messages = await ChatsManager.get();
      socketServer.emit("update-messages", { messages: messages });
    });
  });
};

export const emit = (event, data) => {
  socketServer.emit(event, data);
};
