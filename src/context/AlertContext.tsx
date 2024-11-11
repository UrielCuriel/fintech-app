"use client";
import { createContext, useState, useContext } from "react";

interface AlertType {
  id: string;
  type: string;
  message: string;
  link?: string;
}

interface AlertContextType {
  alerts: AlertType[];
  addAlert: (alert: AlertType) => void;
  removeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<AlertType[]>([]);

  // Función para agregar una alerta
  const addAlert = (alert: AlertType) => {
    if (!alert.id) {
      alert.id = Math.random().toString(36).substr(2, 9);
    }
    if (alerts.find((a) => a.id === alert.id)) {
      return;
    }
    setAlerts((prev) => [...prev, alert]);
  };

  // Función para eliminar una alerta por ID
  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>{children}</AlertContext.Provider>;
}

export const useAlert = () => useContext(AlertContext as React.Context<AlertContextType>);
