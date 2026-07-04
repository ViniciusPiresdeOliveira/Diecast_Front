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

  useEffect(() => {
    async function loadUser() {
      try {
        const { data } = await getAuthMe();
        handleUser(data.name, data.role);
      } catch (err) {
        handleClearUser();
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
