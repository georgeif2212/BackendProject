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
    console.log(paymentIntent);
    if (paymentIntent.status == "succeeded") {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "¡Tu pago ha sido exitoso!",
        showConfirmButton: true,
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "http://localhost:8080/views/profile";
        }
      });
    }
  });
});
