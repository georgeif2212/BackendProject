import http from "http";
import app from "./app.js";
import { init } from "./socket.js";
import { initDB } from "./db/mongodb.js";


await initDB();
const server = http.createServer(app);
const PORT = 8080;

init(server);


server.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT} 🤩`);
});
