import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface WalletData {
  balance: number;
  currency: string;
  updatedAt: string;
}

export function Wallet() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="animate-pulse p-4 bg-white rounded-lg shadow">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
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
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-500">
              {wallet?.currency}
            </p>
            <p className="text-lg font-semibold text-gray-900">
              {wallet?.balance.toFixed(2)}
            </p>
          </div>
          <div className={`text-sm font-medium ${(wallet?.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {(wallet?.balance || 0) >= 0 ? 'Available' : 'Overdrawn'}
          </div>
        </div>
        <div className="text-sm text-gray-500 text-right">
          Last updated: {new Date(wallet?.updatedAt || '').toLocaleString()}
        </div>
      </div>
    </div>
  );
} 