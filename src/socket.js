import { Server } from "socket.io";
import { products } from "./routers/products.router.js";

let socketServer;
export const init = (httpServer) => {
  socketServer = new Server(httpServer);
  // * socketServer.on Permite configurar eventos que queremos escuchar
  // * socketClient es el client que se conecta
  socketServer.on("connection", (socketClient) => {
    console.log(`Nuevo cliente socket conectado ${socketClient.id} 🎊`);
    socketClient.emit("update-list-products", { products });
    socketClient.on("new-product", (productData) => {
      products.push(productData);
      socketServer.emit("update-list-products", { products });
    });
  });
};

export const emit = (event, data) => {
  socketServer.emit(event, data);
};
