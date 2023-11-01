import http from 'http';

import app from './app.js';

const server = http.createServer(app);
const PORT = 8080;


app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT} 🤩`);
});