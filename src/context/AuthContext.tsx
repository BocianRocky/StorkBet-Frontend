import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../services/auth';
import { login as apiLogin, register as apiRegister } from '../services/auth';
import { clearPersistedAuth, getPersistedAuth, persistAuth } from '../services/fetchWithAuth';

export interface AuthUser {
  userId: number;
  name: string;
  lastName: string;
  email: string;
  accountBalance: number;
  roleId?: number; // 1 = admin, 2 = player
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  refreshTokenExp: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<AuthUser>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
  getRedirectPath: () => string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(() => {
    const persisted = getPersistedAuth();
    if (persisted.accessToken && persisted.refreshToken) {
      const userRaw = localStorage.getItem('auth_user');
      const user = userRaw ? (JSON.parse(userRaw) as AuthUser) : null;
      return {
        user,
        accessToken: persisted.accessToken,
        refreshToken: persisted.refreshToken,
        refreshTokenExp: persisted.refreshTokenExp,
      };
    }
    return { user: null, accessToken: null, refreshToken: null, refreshTokenExp: null };
  });

  // Helper function to parse role from JWT token
  const parseRoleFromToken = useCallback((token: string): number => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;
      if (role === 'Admin') return 1;
      if (role === 'Player') return 2;
      return 2; // default to player role
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      return 2; // default to player role
    }
  }, []);

  const persistAll = useCallback((auth: AuthResponse) => {
    persistAuth({
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
      refreshTokenExp: auth.refreshTokenExp,
    });
    
    // Parse role from JWT token if not provided in response
    const roleId = auth.roleId ?? auth.role ?? parseRoleFromToken(auth.accessToken);
    
    const nextUser: AuthUser = {
      userId: auth.userId,
      name: auth.name,
      lastName: auth.lastName,
      email: auth.email,
      accountBalance: auth.accountBalance,
      roleId,
    };
    localStorage.setItem('auth_user', JSON.stringify(nextUser));
    setState({
      user: nextUser,
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
      refreshTokenExp: auth.refreshTokenExp,
    });
  }, [parseRoleFromToken]);

  const login = useCallback(async (payload: LoginRequest): Promise<AuthUser> => {
    const res = await apiLogin(payload);
    persistAll(res);
    
    // Parse role from JWT token if not provided in response
    const roleId = res.roleId ?? res.role ?? parseRoleFromToken(res.accessToken);
    
    const user: AuthUser = {
      userId: res.userId,
      name: res.name,
      lastName: res.lastName,
      email: res.email,
      accountBalance: res.accountBalance,
      roleId,
    };
    
    return user;
  }, [persistAll, parseRoleFromToken]);

  const register = useCallback(async (payload: RegisterRequest) => {
    const res = await apiRegister(payload);
    // Jeśli backend nie zwraca tokenów (np. 204), nie ustawiaj sesji – użytkownik jest zarejestrowany,
    // ale musi się zalogować.
    if (!res) return;
    persistAll(res);
  }, [persistAll]);

  const logout = useCallback(() => {
    clearPersistedAuth();
    localStorage.removeItem('auth_user');
    setState({ user: null, accessToken: null, refreshToken: null, refreshTokenExp: null });
  }, []);

  const getRedirectPath = useCallback(() => {
    if (!state.user) return '/';
    return state.user.roleId === 1 ? '/admin/dashboard' : '/';
  }, [state.user]);

  useEffect(() => {
    // Optional: sync between tabs
    function onStorage(e: StorageEvent) {
      if (e.key === 'auth' || e.key === 'auth_user') {
        const persisted = getPersistedAuth();
        const userRaw = localStorage.getItem('auth_user');
        const user = userRaw ? (JSON.parse(userRaw) as AuthUser) : null;
        setState({
          user,
          accessToken: persisted.accessToken,
          refreshToken: persisted.refreshToken,
          refreshTokenExp: persisted.refreshTokenExp,
        });
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user: state.user,
    isAuthenticated: Boolean(state.accessToken && state.user),
    login,
    register,
    logout,
    getRedirectPath,
  }), [state.user, state.accessToken, login, register, logout, getRedirectPath]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


