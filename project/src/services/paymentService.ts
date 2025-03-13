import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLIC_KEY = 'pk_test_51R2JJpD5G8RRyYEILj6F5GpJszdtNOmdfUyPmaJi6F0c9AzwHQTWuUsepz9jS5TXpYZzirxFejg9uqeVURcZ3CVW00JvOJhhJB';

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

interface CheckoutSession {
  sessionId: string;
}

export const paymentService = {
  async createCheckoutSession(amount: number) {
    try {
      // First create checkout session on backend
      const response = await fetch('http://localhost:3001/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json() as CheckoutSession;

      // Then redirect to Stripe checkout
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Failed to load Stripe');

      const { error } = await stripe.redirectToCheckout({
        sessionId
      });

      if (error) throw new Error(error.message);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Payment error: ${error.message}`);
      }
      throw new Error('An unknown error occurred during payment');
    }
  }
};