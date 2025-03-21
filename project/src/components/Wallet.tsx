import React, { useEffect } from 'react';
import { useWalletStore } from '../store/walletStore';

export function Wallet() {
  const { balances, isLoading, error, fetchBalances } = useWalletStore();

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  if (isLoading) {
    return (
      <div className="animate-pulse p-4 bg-white rounded-lg shadow">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Wallet</h2>
      
      <div className="space-y-4">
        {balances.map((balance) => (
          <div
            key={balance.currency}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="text-sm font-medium text-gray-500">
                {balance.currency}
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {balance.amount.toFixed(2)}
              </p>
            </div>
            <div className={`text-sm font-medium ${balance.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {balance.amount >= 0 ? 'Available' : 'Overdrawn'}
            </div>
          </div>
        ))}

        {balances.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No balances available
          </p>
        )}
      </div>
    </div>
  );
} 