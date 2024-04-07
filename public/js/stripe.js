document.addEventListener("DOMContentLoaded", function () {
  const stripe = Stripe(
    "pk_test_51OxzWhP0pgWJc8xjl38WZy8EkFXEZCVr86mEKnQg3GOq8dbQ1l5NX7wLCUZ4BMd2NrOtQulBYjs21X3yY0FGKMPB00DscRqwC9"
  );
  const elements = stripe.elements();
  const card = elements.create("card");
  card.mount("#card-element");

  const form = document.getElementById("payment-form");
  const clientSecret =
    document.getElementById("payment-form").dataset.clientSecret;
  const cartId = document.getElementById("payment-form").dataset.cartId;

  let submitted = false;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (submitted) {
      return;
    }
    submitted = true;
    form.querySelector("button").disabled = true;

    const nameInput = document.querySelector("#name");

    // Confirm the card payment given the clientSecret
    // from the payment intent that was just created on
    // the server.
    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: nameInput.value,
          },
        },
      });

    if (stripeError) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se completó el pago",
        footer: '<a href="#">Ayuda</a>',
      });

      submitted = false;
      form.querySelector("button").disabled = false;
      return;
    }

    if (paymentIntent.status == "succeeded") {
      fetch(`/api/carts/${cartId}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to complete purchase");
          }
          return response.json();
        })
        .then((ticket) => {
          // Verifica si la compra fue exitosa
          if (ticket.status === "success") {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "¡Tu pago ha sido exitoso!",
              showConfirmButton: true,
              allowOutsideClick: false,
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = "http://localhost:8080/views/tickets";
              }
            });
          } else {
            // La compra no fue exitosa
            throw new Error("Failed to complete purchase");
          }
        })
        .catch((error) => {
          console.error("Error completing purchase:", error);
          // Maneja el error, muestra un mensaje de error al usuario, etc.
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Error al procesar la compra",
            text: "Hubo un problema al procesar tu compra. Por favor, inténtalo de nuevo más tarde.",
            showConfirmButton: true,
            allowOutsideClick: false,
          });
        });
    }
  });
});
