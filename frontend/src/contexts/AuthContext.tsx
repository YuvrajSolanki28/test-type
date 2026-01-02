import { useState, useEffect, type ReactNode } from "react";
import { AuthContext, type User } from "./authTypes";
import axios from 'axios';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(response => {
        if (response.data.user) {
          setUser(response.data.user);
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
      });
    }
  }, []);

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        setUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
