import { supabase } from './supabase';

export interface TradeOrder {
  id: string;
  order_type: 'buy' | 'sell';
  base_currency: string;
  quote_currency: string;
  amount: number;
  price: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Transaction {
  id: string;
  transaction_type: 'deposit' | 'withdrawal' | 'trade';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export const api = {
  async getProfile() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProfile(profile: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createTradeOrder(order: Partial<TradeOrder>) {
    const { data, error } = await supabase
      .from('trade_orders')
      .insert([order])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getTradeOrders() {
    const { data, error } = await supabase
      .from('trade_orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getMarketRates() {
    const { data, error } = await supabase
      .from('market_rates')
      .select('*');
    
    if (error) throw error;
    return data;
  }
};