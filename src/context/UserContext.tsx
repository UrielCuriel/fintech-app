"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

interface User {
  id?: string;
  email: string;
  full_name?: string;
  otp_enabled?: boolean;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  logout: () => void;
  updateUser: (newUser: User) => Promise<void>;
  enableOtp: () => Promise<void>;
  otpQR: string | null;
  login: (email: string, password: string) => Promise<void>;
  verifyOtp: (otp: string, tempToken: string) => Promise<void>;
  requiresTotp: boolean;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpQR, setOtpQR] = useState<string | null>(null);
  const [requiresTotp, setRequiresTotp] = useState(false);
  const [tempToken, setTempToken] = useState<string | null>(null);

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login/access-token`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        if (result.requires_totp) {
          setRequiresTotp(true);
          setTempToken(result.temp_token);
        } else {
          Cookies.set("access_token", result.access_token, { secure: true });
          fetchUser();
          redirect("/dashboard");
        }
      } else {
        setError(result.message || "Invalid login");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError("Something went wrong, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Función para verificar OTP
  const verifyOtp = async (otp: string) => {
    setLoading(true);
    setError("");

    try {
      if (!tempToken) return setError("Something went wrong, please try again later.");
      const formData = new FormData();
      formData.append("totp_code", otp);
      formData.append("temp_token", tempToken);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login/access-token/otp`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        Cookies.set("access_token", result.access_token, { secure: true });
        setRequiresTotp(false);
        fetchUser();
        redirect("/dashboard");
      } else {
        setError(result.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("Error validating OTP:", err);
      setError("Something went wrong, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = useCallback(async () => {
    const token = Cookies.get("access_token");
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setUser(await response.json());
      } else {
        logout();
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      logout();
    }
  }, []);

  const updateUser = async (newUser: User) => {
    setLoading(true);
    if (!newUser) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${Cookies.get("access_token")}`, "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/password`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      if (response.ok) {
        // Password updated successfully
      } else {
        setError("Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setError("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const enableOtp = async () => {
    setLoading(true);
    //if otp is already enabled, return
    if (user?.otp_enabled) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp/enable`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
      });
      if (response.ok) {
        const qrResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/otp/generate`, {
          method: "GET",
          headers: { Authorization: `Bearer ${Cookies.get("access_token")}`, "Content-Type": "image/png" },
        });
        const qrData = await qrResponse.blob();
        const qrUrl = URL.createObjectURL(qrData);
        setOtpQR(qrUrl);
      }
    } catch (error) {
      console.error("Error enabling OTP:", error);
      setError("Failed to enable OTP");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove("access_token");
    setUser(null);
    redirect("/login");
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        fetchUser,
        logout,
        updateUser,
        enableOtp,
        otpQR,
        login,
        verifyOtp,
        requiresTotp,
        updatePassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
