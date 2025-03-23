import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface WalletData {
  balance: number;
  currency: string;
  updatedAt: string;
}

const WalletCard = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);

  const fetchWallet = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/wallet/${user?.uid}`);
      if (!response.ok) throw new Error('Failed to fetch wallet data');
      const data = await response.json();
      setWallet(data);
      setError(null);
    } catch (err) {
      setError('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWallet();
    }
  }, [user]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !depositAmount) return;

    setIsDepositing(true);
    try {
      const response = await fetch('http://localhost:5000/api/wallet/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          amount: parseFloat(depositAmount),
        }),
      });

      if (!response.ok) throw new Error('Deposit failed');
      
      await fetchWallet();
      setShowDepositModal(false);
      setDepositAmount('');
    } catch (err) {
      setError('Failed to process deposit');
    } finally {
      setIsDepositing(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-white rounded-lg shadow p-6">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-3 mt-4">
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Wallet</h2>
        <button
          onClick={() => setShowDepositModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Deposit
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mt-4">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">Available Balance</p>
            <p className="text-2xl font-bold text-gray-900">
              {wallet?.currency} {wallet?.balance.toFixed(2)}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date(wallet?.updatedAt || '').toLocaleString()}
          </div>
        </div>
      </div>

      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Deposit Funds</h3>
            <form onSubmit={handleDeposit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount ({wallet?.currency})
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDepositing}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {isDepositing ? 'Processing...' : 'Confirm Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletCard; 