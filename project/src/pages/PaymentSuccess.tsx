import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate updating the wallet balance
    // In a real app, you would verify the payment with Stripe
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-4">
          Your funds will be added to your wallet shortly.
        </p>
        <p className="text-sm text-gray-500">
          Redirecting to dashboard...
        </p>
      </div>
    </div>
  );
}