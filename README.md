# 🧑‍💻 BackendProject

Repositorio para un completo backend de e-commerce desarrollado en Node.js, Express y MongoDB, con autenticación, manejo de productos, carritos, chat en tiempo real, pagos con Stripe, carga de documentos y más.

---

## 🚀 Tecnologías y dependencias principales

- **Node.js** & **Express**: Framework principal del servidor.
- **MongoDB** & **Mongoose**: Base de datos NoSQL y ODM.
- **Mongoose-paginate-v2**: Paginación eficiente de colecciones.
- **Handlebars**: Motor de plantillas para vistas dinámicas.
- **Socket.io**: Comunicación en tiempo real (chat y productos en vivo).
- **Passport** (local, JWT, GitHub): Autenticación robusta.
- **Multer**: Carga de archivos y documentos de usuario.
- **Stripe**: Integración de pagos.
- **Winston**: Logger profesional con niveles personalizados.
- **Swagger**: Documentación interactiva de la API.
- **Nodemailer**: Envío de correos electrónicos (recuperación de contraseña, notificaciones).
- **@faker-js/faker**: Generación de datos mock para testing.
- **Mocha, Chai, Supertest**: Testing unitario y de integración.
- **dotenv**: Variables de entorno.

---

## 📁 Estructura del proyecto

```
src/
  app.js                # Configuración principal de la app Express
  server.js             # Inicialización del servidor HTTP
  socket.js             # Configuración de Socket.io
  config/               # Configuración general, logger y passport
  controllers/          # Lógica de negocio (users, products, carts, chats, tickets)
  dao/                  # Acceso a datos (MongoDB, modelos)
  db/                   # Conexión a la base de datos
  docs/                 # Documentación Swagger
  dto/                  # Data Transfer Objects
  middlewares/          # Middlewares personalizados (auth, error handler, etc.)
  repositories/         # Abstracción de acceso a datos (repositorios)
  resources/            # Recursos estáticos o utilitarios
  routers/              # Rutas de la API y vistas
  services/             # Servicios de negocio
  utils/                # Utilidades generales (hash, email, paginación, etc.)
  views/                # Vistas Handlebars (login, registro, productos, carrito, chat, etc.)
public/
  css/                  # Estilos
  images/               # Imágenes de productos
  js/                   # Scripts frontend (chat, productos, Stripe, etc.)
tests/
  integrations/         # Pruebas de integración
.env                    # Variables de entorno
package.json            # Dependencias y scripts
```

---

## 🛠️ Funcionalidades principales

### 👤 Autenticación y usuarios
- Registro y login local, JWT y GitHub.
- Recuperación y cambio de contraseña por email.
- Roles: user, premium, admin.
- Carga y gestión de documentos personales.
- Promoción automática a "premium" si sube todos los documentos requeridos.

### 🛒 Productos y carritos
- CRUD de productos (con imágenes).
- Paginación, búsqueda y filtrado.
- Carrito de compras persistente por usuario.
- Vista de productos en tiempo real (Socket.io).

### 💬 Chat en tiempo real
- Chat global usando Socket.io.
- Persistencia de mensajes en MongoDB.

### 💳 Pagos y tickets
- Integración con Stripe para pagos.
- Generación de tickets de compra.
- Envío de email de confirmación tras la compra.

### 📄 Documentación y testing
- Documentación Swagger disponible en `/api-docs`.
- Pruebas unitarias y de integración con Mocha, Chai y Supertest.
- Mocking de datos con Faker.

### 📝 Logging y manejo de errores
- Logger avanzado con Winston (niveles: debug, info, warning, error, fatal).
- Manejo centralizado de errores y respuestas estándar.

---

## ⚙️ Scripts útiles

- `npm run dev` — Inicia el servidor en modo desarrollo con nodemon.
- `npm start` — Inicia el servidor en modo producción.
- `npm test` — Ejecuta los tests (si están configurados).

---

## 📄 Documentación de la API

La documentación interactiva está disponible en [http://localhost:8080/api-docs](http://localhost:8080/api-docs) una vez iniciado el servidor.

---

## 🧪 Testing

El proyecto incluye pruebas unitarias y de integración en la carpeta [`tests/`](tests/), utilizando Mocha, Chai y Supertest.

---

## 📝 Convención de commits

Se utiliza la convención [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo: Descripción breve

Cuerpo opcional explicando el cambio.

Closes #número_de_issue
```

Ejemplo:
```
feat: Agregar función de búsqueda de usuarios

Añade una nueva función de búsqueda que permite a los usuarios encontrar otros usuarios por nombre de usuario.

Closes #123
```

---

## 👨‍💻 Autor

Jorge Infante

---

## 📬 Contribuciones

¡Las contribuciones son bienvenidas! Por favor, abre un issue o pull request.

---

## 📝 Licencia

MIT

---

## 📦 Dependencias principales

Consulta el archivo [`package.json`](package.json) para ver todas las dependencias y versiones utilizadas.
