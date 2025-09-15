import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService, AuthState, User } from '@/lib/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check for existing auth on mount
    const user = AuthService.getCurrentUser();
    if (user) {
      setAuthState({ user, isAuthenticated: true });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = AuthService.login(email, password);
    if (user) {
      setAuthState({ user, isAuthenticated: true });
      return true;
    }
    return false;
  };

  const logout = () => {
    AuthService.logout();
    setAuthState({ user: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}