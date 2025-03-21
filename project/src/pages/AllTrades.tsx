import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useWalletStore } from '../store/walletStore';
import { Wallet } from '../components/Wallet';

interface Trade {
  _id: string;
  userId: string;
  currencyPair: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export function AllTrades() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Trade>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { executeTrade, balances, fetchBalances } = useWalletStore();
  const [isExecuting, setIsExecuting] = useState(false);
  const [tradeError, setTradeError] = useState<string | null>(null);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/trades');
        setTrades(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch trades. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
    // Refresh trades every 30 seconds
    const interval = setInterval(fetchTrades, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSort = (field: keyof Trade) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredAndSortedTrades = trades
    .filter(trade => statusFilter === 'all' || trade.status === statusFilter)
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * direction;
      }
      return ((aValue as any) - (bValue as any)) * direction;
    });

  const handleTradeClick = (trade: Trade) => {
    setSelectedTrade(trade);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTrade(null);
  };

  const handleTradeExecution = async (type: 'buy' | 'sell') => {
    if (!selectedTrade) return;

    try {
      setIsExecuting(true);
      setTradeError(null);

      // Check if user has sufficient balance
      const [baseCurrency, quoteCurrency] = selectedTrade.currencyPair.split('/');
      const totalCost = selectedTrade.amount * selectedTrade.price;
      
      const baseBalance = balances.find(b => b.currency === baseCurrency)?.amount || 0;
      const quoteBalance = balances.find(b => b.currency === quoteCurrency)?.amount || 0;

      if (type === 'buy' && quoteBalance < totalCost) {
        throw new Error(`Insufficient ${quoteCurrency} balance. Required: ${totalCost.toFixed(2)}`);
      } else if (type === 'sell' && baseBalance < selectedTrade.amount) {
        throw new Error(`Insufficient ${baseCurrency} balance. Required: ${selectedTrade.amount.toFixed(2)}`);
      }

      await executeTrade(
        selectedTrade._id,
        type,
        selectedTrade.amount,
        selectedTrade.price,
        selectedTrade.currencyPair
      );

      // Close modal and refresh trades
      closeModal();
      const response = await axios.get('http://localhost:5000/api/trades');
      setTrades(response.data);
    } catch (err) {
      setTradeError(err instanceof Error ? err.message : 'Failed to execute trade');
    } finally {
      setIsExecuting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Trades</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort('currencyPair')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Currency Pair
                {sortField === 'currencyPair' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th
                onClick={() => handleSort('type')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Type
                {sortField === 'type' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th
                onClick={() => handleSort('amount')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Amount
                {sortField === 'amount' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th
                onClick={() => handleSort('price')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Price
                {sortField === 'price' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th
                onClick={() => handleSort('status')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Status
                {sortField === 'status' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th
                onClick={() => handleSort('createdAt')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Date
                {sortField === 'createdAt' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedTrades.map((trade) => (
              <tr 
                key={trade._id} 
                className="hover:bg-gray-50 cursor-pointer" 
                onClick={() => handleTradeClick(trade)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {trade.currencyPair}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={trade.type === 'buy' ? 'text-green-600' : 'text-red-600'}>
                    {trade.type.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {trade.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {trade.price.toFixed(4)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(trade.status)}`}>
                    {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(trade.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Total trades: {filteredAndSortedTrades.length}
      </div>

      {/* Trade Details Modal */}
      {isModalOpen && selectedTrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Trade Details</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {tradeError && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {tradeError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Trade ID</p>
                    <p className="font-medium">{selectedTrade._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Currency Pair</p>
                    <p className="font-medium">{selectedTrade.currencyPair}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className={`font-medium ${selectedTrade.type === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedTrade.type.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-medium">{selectedTrade.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium">{selectedTrade.price.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Cost</p>
                    <p className="font-medium">{(selectedTrade.amount * selectedTrade.price).toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedTrade.status)}`}>
                      {selectedTrade.status.charAt(0).toUpperCase() + selectedTrade.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="font-medium">{new Date(selectedTrade.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-6">
                <h3 className="text-lg font-semibold mb-4">Your Wallet</h3>
                <Wallet />
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              {selectedTrade.type === 'buy' ? (
                <button
                  onClick={() => handleTradeExecution('buy')}
                  disabled={isExecuting}
                  className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExecuting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    `Buy ${selectedTrade.amount.toFixed(2)} ${selectedTrade.currencyPair}`
                  )}
                </button>
              ) : (
                <button
                  onClick={() => handleTradeExecution('sell')}
                  disabled={isExecuting}
                  className="flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExecuting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    `Sell ${selectedTrade.amount.toFixed(2)} ${selectedTrade.currencyPair}`
                  )}
                </button>
              )}
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}