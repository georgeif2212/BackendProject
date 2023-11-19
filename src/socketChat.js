import { Server } from "socket.io";
// import ProductManager from "./dao/ProductManagerFS.js";
import ChatsManager from "./dao/Chats.manager.js";
import { __dirname } from "./utils.js";

let socketServer;
export const initChat = (httpServer) => {
  socketServer = new Server(httpServer);
  // * socketServer.on Permite configurar eventos que queremos escuchar
  // * socketClient es el client que se conecta
  socketServer.on("connection", async (socketClient) => {
    console.log(`Nuevo cliente socket conectado ${socketClient.id} 🎊`);

    const messages = await ChatsManager.get();
    socketClient.emit("update-messages", { messages: messages });

    socketClient.on("new-message", async (newMessage) => {
      await ChatsManager.create(newMessage);

      const messages = await ChatsManager.get();
      socketServer.emit("update-messages", { messages: messages });
    });
  });
};
