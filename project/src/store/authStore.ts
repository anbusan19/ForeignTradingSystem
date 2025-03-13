import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  },
  signUp: async (email, password) => {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) throw signUpError;

    // The profile will be created automatically by the database trigger
    // No need to manually create it or handle deletion
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },
}));

// Set up auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    useAuthStore.getState().setUser(session.user);
  } else {
    useAuthStore.getState().setUser(null);
  }
});