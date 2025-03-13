import { ArrowUpDown, BarChart3, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PaymentModal } from '../components/PaymentModal';
import { api } from '../lib/api';
import { paymentService } from '../services/paymentService';
import { useAuthStore } from '../store/authStore';

interface MarketRate {
  base_currency: string;
  quote_currency: string;
  rate: number;
  last_updated_at: string;
}

interface TradeOrder {
  id: string;
  order_type: 'buy' | 'sell';
  base_currency: string;
  quote_currency: string;
  amount: number;
  price: number;
  status: string;
  created_at: string;
}

export function Dashboard() {
  const { user } = useAuthStore();
  const [marketRates, setMarketRates] = useState<MarketRate[]>([]);
  const [orders, setOrders] = useState<TradeOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState({
    balance: 0,
    currency: 'USD'
  });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [ratesData, ordersData] = await Promise.all([
          api.getMarketRates(),
          api.getTradeOrders()
        ]);
        setMarketRates(ratesData);
        setOrders(ordersData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const handleDeposit = async () => {
    try {
      setLoading(true);
      setError(null);
      await paymentService.createCheckoutSession(100); // Example: $100 deposit
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to FTS</h2>
        <p className="text-gray-600">
          Hello {user?.email}, welcome to your Foreign Trading System dashboard.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Market Overview</h3>
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
          <div className="space-y-3">
            {marketRates.slice(0, 3).map((rate) => (
              <div key={`${rate.base_currency}-${rate.quote_currency}`} className="flex justify-between items-center">
                <span className="text-gray-600">
                  {rate.base_currency}/{rate.quote_currency}
                </span>
                <span className="font-medium">{rate.rate.toFixed(4)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <ArrowUpDown className="h-6 w-6 text-blue-600" />
          </div>
          <div className="space-y-3">
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex justify-between items-center">
                <div>
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    order.order_type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {order.order_type.toUpperCase()}
                  </span>
                  <span className="ml-2 text-gray-600">
                    {order.base_currency}/{order.quote_currency}
                  </span>
                </div>
                <span className="font-medium">{order.amount}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Portfolio</h3>
            <Wallet className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Wallet Balance</h2>
              <p className="text-3xl font-bold">${wallet.balance.toFixed(2)} {wallet.currency}</p>
            </div>
            <button
              onClick={handleDeposit}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Deposit Funds'}
            </button>
          </div>
          {error && (
            <div className="mt-4 text-red-600 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handleDeposit}
      />
    </div>
  );
}