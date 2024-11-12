"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getUser, logout } from "@/actions/sessionActions";
import { redirect } from "next/navigation";
interface User {
  id?: string;
  email: string;
  full_name?: string;
  otp_enabled?: boolean;
}

interface UserContextType {
  user: User | null;
  refetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = useCallback(async () => {
    const userData = await getUser();
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    redirect("/login");
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return <UserContext.Provider value={{ user, refetchUser: fetchUser, logout: handleLogout }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};
