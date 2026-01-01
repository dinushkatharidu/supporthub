import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Role } from "../types/auth";
import * as authApi from "../api/auth";

type AuthUser = {
  email: string;
  roles: Role[];
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (...roles: Role[]) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "access_token";
const USER_KEY = "auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  // restore from localStorage on refresh
  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    const u = localStorage.getItem(USER_KEY);
    if (t && u) {
      setToken(t);
      setUser(JSON.parse(u));
    }
  }, []);

  const isAuthenticated = !!token;

  async function login(email: string, password: string) {
    const data = await authApi.login({ email, password });

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({ email: data.email, roles: data.roles })
    );

    setToken(data.token);
    setUser({ email: data.email, roles: data.roles });
  }

  async function register(email: string, password: string) {
    const data = await authApi.register({ email, password });

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({ email: data.email, roles: data.roles })
    );

    setToken(data.token);
    setUser({ email: data.email, roles: data.roles });
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }

  function hasRole(...roles: Role[]) {
    if (!user) return false;
    return roles.some((r) => user.roles.includes(r));
  }

  const value = useMemo(
    () => ({ user, token, isAuthenticated, login, register, logout, hasRole }),
    [user, token, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
