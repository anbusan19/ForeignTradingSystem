import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function PaymentCancel() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-4">
          Your payment was cancelled. No charges were made.
        </p>
        <p className="text-sm text-gray-500">
          Redirecting to dashboard...
        </p>
      </div>
    </div>
  );
}