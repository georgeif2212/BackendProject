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
