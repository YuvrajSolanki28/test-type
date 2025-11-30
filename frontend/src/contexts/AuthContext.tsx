import { useState, createContext, useContext, useCallback, type ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  signOut: () => void;
  updateProfile: (updates: Partial<Omit<User, "id" | "email">>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "typespeed_token";
const USER_KEY = "typespeed_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const updateProfile = useCallback(
    (updates: Partial<Omit<User, "id" | "email">>) => {
      if (!user) return;
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        setUser,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
