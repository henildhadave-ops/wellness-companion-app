import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  name: string;
  freeSessions: number;
  totalSessions: number;
  subscriptionStatus: 'free' | 'active' | 'expired';
  subscriptionEndDate?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  consumeSession: () => Promise<void>;
  addSessions: (count: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth on app launch
  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (e) {
      console.error('Failed to restore session:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // In production, this would call a backend API
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        name,
        freeSessions: 3,
        totalSessions: 3,
        subscriptionStatus: 'free',
      };

      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      throw new Error('Sign up failed');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // In production, this would call a backend API
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.email === email) {
          setUser(parsedUser);
          return;
        }
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      throw new Error('Sign in failed');
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      throw new Error('Sign out failed');
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const updatedUser = { ...user, ...updates };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      throw new Error('Update failed');
    }
  };

  const consumeSession = async () => {
    if (!user) return;

    try {
      const updatedUser = {
        ...user,
        freeSessions: Math.max(0, user.freeSessions - 1),
        totalSessions: user.totalSessions - 1,
      };
      await updateUser(updatedUser);
    } catch (error) {
      throw new Error('Failed to consume session');
    }
  };

  const addSessions = async (count: number) => {
    if (!user) return;

    try {
      const updatedUser = {
        ...user,
        totalSessions: user.totalSessions + count,
      };
      await updateUser(updatedUser);
    } catch (error) {
      throw new Error('Failed to add sessions');
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isSignedIn: !!user,
    signUp,
    signIn,
    signOut,
    updateUser,
    consumeSession,
    addSessions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
