import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExchangeRate, exchangeRatesService } from '../services/exchangeRatesService';

const POPULAR_CURRENCIES = ['EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];

export function ExchangeRates() {
  const [rates, setRates] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [baseCurrency, setBaseCurrency] = useState('USD');

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const data = await exchangeRatesService.getLatestRates(baseCurrency);
        setRates(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch exchange rates');
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [baseCurrency]);

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Exchange Rates</h1>
        <select
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="USD">USD</option>
          {POPULAR_CURRENCIES.map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {POPULAR_CURRENCIES.map(currency => (
          <div key={currency} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">{currency}</span>
              <span className="text-xl">
                {rates?.rates[currency]?.toFixed(4)}
              </span>
            </div>
            <Link
              to={`/exchange-rates/chart/${currency}`}
              className="text-blue-600 hover:text-blue-800 text-sm mt-2 block"
            >
              View Chart →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}