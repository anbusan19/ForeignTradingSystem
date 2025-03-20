import { getFirestore, collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth } from '../config/firebase';

const db = getFirestore();

export interface TradeOrder {
  id: string;
  userId: string;
  currencyPair: string;
  amount: number;
  type: 'buy' | 'sell';
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
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

export const createTransaction = async (transactionData: Partial<TradeOrder>) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const docRef = await addDoc(collection(db, 'transactions'), {
      ...transactionData,
      userId: user.uid,
      createdAt: new Date(),
    });
    return { id: docRef.id, ...transactionData };
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

export const getTransactions = async (): Promise<TradeOrder[]> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TradeOrder[];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const updateTransaction = async (id: string, updates: Partial<TradeOrder>) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const docRef = doc(db, 'transactions', id);
    await updateDoc(docRef, updates);
    return { id, ...updates };
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

export const deleteTransaction = async (id: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    await deleteDoc(doc(db, 'transactions', id));
    return { id };
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};