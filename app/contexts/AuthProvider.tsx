"use client";

import { createContext, useEffect, useState } from "react";
import { getAuthMe } from "../api/login";

type UserType = "ADMIN" | "USER";

interface User {
  name: string;
  role: UserType;
}

type AuthContextType = {
  user: User | null;
  handleUser: (name: string, role: UserType) => void;
  handleClearUser: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const handleUser = (name: string, role: UserType) => {
    setUser({ name, role });
  };

  const handleClearUser = () => {
    setUser(null);
  };

  const checkHasToken = async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/has-token");
      const { hasToken } = await res.json();
      return hasToken;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    async function loadUser() {
      const hasToken = await checkHasToken();

      if (!hasToken) {
        handleClearUser();
        return;
      }

      try {
        const { data } = await getAuthMe();
        handleUser(data.login, data.role);
      } catch (err) {
        handleClearUser();
        await fetch("/api/logout", { method: "POST" });
      }
    }

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, handleUser, handleClearUser }}>
      {children}
    </AuthContext.Provider>
  );
}
