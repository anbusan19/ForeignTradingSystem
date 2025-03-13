import {
    CardElement,
    Elements,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useState } from 'react';

const stripePromise = loadStripe('pk_test_51R2JJpD5G8RRyYEILj6F5GpJszdtNOmdfUyPmaJi6F0c9AzwHQTWuUsepz9jS5TXpYZzirxFejg9uqeVURcZ3CVW00JvOJhhJB');

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

const PaymentForm = ({ onClose, onSuccess }: Omit<PaymentModalProps, 'isOpen'>) => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)!,
    });

    if (stripeError) {
      setError(stripeError.message ?? 'Payment failed');
      setLoading(false);
      return;
    }

    try {
      // Here you would typically make an API call to your backend
      // to process the payment and update the wallet
      // For now, we'll simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSuccess(Number(amount));
      onClose();
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Amount (USD)</label>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter amount"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Card Details</label>
        <div className="mt-1 block w-full rounded-md border border-gray-300 p-4">
          <CardElement />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !amount}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay'}
        </button>
      </div>
    </form>
  );
};

export function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30"></div>
        <div className="relative bg-white rounded-lg max-w-md w-full p-6">
          <h2 className="text-xl font-semibold mb-4">Deposit Funds</h2>
          <Elements stripe={stripePromise}>
            <PaymentForm onClose={onClose} onSuccess={onSuccess} />
          </Elements>
        </div>
      </div>
    </div>
  );
}