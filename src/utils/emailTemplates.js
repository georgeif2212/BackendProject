import EmailService from "../services/email.service.js";
import { generateToken } from "./utils.js";
import path from "path";

export const sendWelcomeEmail = async (user) => {
  const emailService = EmailService.getInstance();
  const result = await emailService.sendEmail(
    user.email,
    `Bienvenido ${user.first_name}!`,
    `<div>
      <h1>Hola ${user.first_name}! Soy Jorge.</h1>
      <h2>Te damos la bienvenida</h2>
      <img src="cid:hello" alt="Hello" />
    </div>`,
    [
      {
        filename: "hello.png",
        path: path.join(__dirname, "../resources/hello.png"),
        cid: "hello",
      },
    ]
  );
  return result;
};

export const sendRecoverPasswordEmail = async (user) => {
  const emailService = EmailService.getInstance();
  const token = generateToken(user, "recoverPassword");
  const recoveryLink = `http://localhost:8080/views/create-new-password?token=${token}`;

  await emailService.sendEmail(
    user.email,
    `¿Quieres recuperar tu contraseña, ${user.first_name}?`,
    `<div>
      <h1>Da click en el siguiente enlace para recuperar tu contraseña</h1>
      <a href="${recoveryLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Recuperar Contraseña</a>
    </div>`
  );
};

export const sendDeletedProductEmail = async (user, product) => {
  const emailService = EmailService.getInstance();
  const result = await emailService.sendEmail(
    user.email,
    `Tu producto fue eliminado`,
    `<div>
      <h1>Hola ${user.first_name}! </h1>
      <p>Te notificamos que tu producto con nombre <b>${product.title}</b> fue eliminado </p>
    </div>`
  );
  return result;
};

export const sendSuccessfulPurchaseEmail = async (data) => {
  const emailService = EmailService.getInstance();
  const user = data.user;
  const ticket = data.ticket;
  const availableProducts = data.availableProducts;

  const productsTableRows = availableProducts
    .map((element) => {
      return `
      <tr>
        <td>${element.product.title}</td>
        <td>${element.quantity}</td>
        <td>$${element.product.price}</td>
      </tr>
    `;
    })
    .join("");

  const emailContent = `
    <div>
      <h1>Hola ${user.first_name}!</h1>
      <p>Te notificamos que tu compra se ha completado con éxito.</p>
      <table>
        <thead>
          <tr>
            <th>Código de compra</th>
            <th>Precio final</th>
            <th>Email asociado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${ticket.code}</td>
            <td>$${ticket.amount}</td>
            <td>${ticket.purchaser}</td>
          </tr>
        </tbody>
      </table>
      <h2>Productos comprados:</h2>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio unitario</th>
          </tr>
        </thead>
        <tbody>
          ${productsTableRows}
        </tbody>
      </table>
    </div>
  `;

  const result = await emailService.sendEmail(
    user.email,
    `Tu compra ha sido exitosa`,
    emailContent
  );

  return result;
};
