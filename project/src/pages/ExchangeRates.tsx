import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { exchangeRatesService, ExchangeRateResponse } from '../services/exchangeRatesService';

const POPULAR_CURRENCIES = ['EUR', 'INR', 'JPY', 'AUD', 'CAD', 'CHF'];
const REFRESH_INTERVAL = 5000; // Refresh every 5 seconds

export function ExchangeRates() {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [rates, setRates] = useState<ExchangeRateResponse>(exchangeRatesService.getLatestRates());

  // Auto-refresh rates
  useEffect(() => {
    const updateRates = () => {
      setRates(exchangeRatesService.getLatestRates(baseCurrency));
    };

    const intervalId = setInterval(updateRates, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [baseCurrency]);

  // Update rates when base currency changes
  useEffect(() => {
    setRates(exchangeRatesService.getLatestRates(baseCurrency));
  }, [baseCurrency]);

  const getExchangeRate = (currency: string): number | null => {
    return rates.rates[currency] || null;
  };

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
        {POPULAR_CURRENCIES.map(currency => {
          const rate = getExchangeRate(currency);
          return (
            <div key={currency} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-semibold">{currency}</span>
                  <p className="text-sm text-gray-500 mt-1">
                    1 {baseCurrency} = {rate?.toFixed(4)} {currency}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-medium">
                    {rate?.toFixed(4)}
                  </span>
                </div>
              </div>
              <Link
                to={`/exchange-rates/chart/${currency}`}
                className="text-blue-600 hover:text-blue-800 text-sm mt-4 inline-block"
              >
                View Chart →
              </Link>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">About Exchange Rates</h2>
        <p className="text-gray-700">
          Exchange rates are simulated with small random fluctuations for demonstration purposes.
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}