(function () {
  let email = "";
  const socket = io();

  document
    .getElementById("form-message")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const input = document.getElementById("input-message");

      const newMsg = {
        user: email,
        message: input.value,
      };
      socket.emit("new-message", newMsg);
      input.value = "";
      input.focus();
    });

  socket.on("update-messages", ({ messages }) => {
    const logMessages = document.getElementById("log-messages");
    logMessages.innerText = "";
    messages.forEach((message) => {
      const p = document.createElement("p");
      p.innerText = `${message.user}: ${message.message}`;
      logMessages.appendChild(p);
    });
  });

  Swal.fire({
    title: "Identificate por favor 👮",
    input: "text",
    inputLabel: "Ingresa tu correo",
    allowOutsideClick: false,
    inputValidator: (value) => {
      if (!value) {
        return "Necesitamos que ingreses un correo para continuar!";
      }
    },
  }).then((result) => {
    email = result.value.trim();
  });
})();
