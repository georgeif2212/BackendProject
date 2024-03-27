import Stripe from "stripe";
import config from "../config/config.js";

export default class PaymentsService {
  constructor() {
    this.stripe = new Stripe(config.stripeBackendKey);
  }
  createPaymentIntent(data) {
    return this.stripe.paymentIntents.create(data);
  }
}
