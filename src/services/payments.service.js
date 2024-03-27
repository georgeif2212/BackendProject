import Stripe from "stripe";

export default class PaymentsService {
  constructor() {
    this.stripe = new Stripe("Secrete Key");
  }
  createPaymentIntent(data) {
    return this.stripe.paymentIntents.create(data);
  }
}
