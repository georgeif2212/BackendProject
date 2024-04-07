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
      // reenable the form.
      submitted = false;
      form.querySelector("button").disabled = false;
      return;
    }
  });
});
