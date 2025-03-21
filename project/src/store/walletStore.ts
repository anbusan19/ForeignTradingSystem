import { create } from 'zustand';
import axios from 'axios';

interface WalletBalance {
  currency: string;
  amount: number;
}

interface WalletStore {
  balances: WalletBalance[];
  isLoading: boolean;
  error: string | null;
  fetchBalances: () => Promise<void>;
  updateBalance: (currency: string, amount: number) => Promise<void>;
  executeTrade: (tradeId: string, type: 'buy' | 'sell', amount: number, price: number, currencyPair: string) => Promise<void>;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  balances: [],
  isLoading: false,
  error: null,

  fetchBalances: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get('http://localhost:5000/api/wallet/balances');
      set({ balances: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch wallet balances', isLoading: false });
    }
  },

  updateBalance: async (currency: string, amount: number) => {
    try {
      set({ isLoading: true, error: null });
      await axios.post('http://localhost:5000/api/wallet/update', {
        currency,
        amount,
      });
      
      // Refresh balances after update
      await get().fetchBalances();
    } catch (error) {
      set({ error: 'Failed to update wallet balance', isLoading: false });
    }
  },

  executeTrade: async (tradeId: string, type: 'buy' | 'sell', amount: number, price: number, currencyPair: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Execute the trade
      await axios.post('http://localhost:5000/api/trades/execute', {
        tradeId,
        type,
        amount,
        price,
        currencyPair,
      });

      // Update wallet balances based on trade
      const [baseCurrency, quoteCurrency] = currencyPair.split('/');
      const totalCost = amount * price;

      if (type === 'buy') {
        await get().updateBalance(baseCurrency, amount);
        await get().updateBalance(quoteCurrency, -totalCost);
      } else {
        await get().updateBalance(baseCurrency, -amount);
        await get().updateBalance(quoteCurrency, totalCost);
      }

      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to execute trade', isLoading: false });
      throw error; // Propagate error to component
    }
  },
})); 