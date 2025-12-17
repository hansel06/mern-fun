import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types/user.types';
import { getToken, getUser, setToken, setUser, removeToken, removeUser } from '../utils/token';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if user is logged in on mount (persist auth on refresh)
  useEffect(() => {
    const token = getToken();
    const userData = getUser();

    if (token && userData) {
      setUserState(userData);
    }
    setLoading(false);
  }, []);

  const login = (token: string, userData: User): void => {
    setToken(token);
    setUser(userData);
    setUserState(userData);
  };

  const logout = (): void => {
    removeToken();
    removeUser();
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

