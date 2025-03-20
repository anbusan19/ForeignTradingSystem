import { User } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { create } from 'zustand';
import { auth } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const googleProvider = new GoogleAuthProvider();

const getAuthErrorMessage = (error: FirebaseError) => {
  switch (error.code) {
    case 'auth/invalid-credential':
      return 'Invalid email or password';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/popup-closed-by-user':
      return 'Sign in was cancelled';
    case 'auth/cancelled-popup-request':
      return 'Sign in was cancelled';
    case 'auth/popup-blocked':
      return 'Sign in popup was blocked by your browser';
    default:
      return 'An error occurred during authentication';
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorMessage = getAuthErrorMessage(error);
        console.error('Error signing in:', error);
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  signUp: async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorMessage = getAuthErrorMessage(error);
        console.error('Error signing up:', error);
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  signInWithGoogle: async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorMessage = getAuthErrorMessage(error);
        console.error('Error signing in with Google:', error);
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw new Error('Failed to sign out');
    }
  },
}));

// Set up auth state listener
onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({ user, loading: false });
});