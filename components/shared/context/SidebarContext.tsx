"use client";

import React, { createContext, useContext, useState } from "react";

export type TSession = {
  userId: number;
  email: string;
  role: string;
};

interface SidebarContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const SidebarContext = createContext<SidebarContextType>({
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
  isCollapsed: false,
  setIsCollapsed: () => {},
});

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsedState] = useState(false);

  // Initialize from localStorage on client side mount
  React.useEffect(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    if (saved !== null) {
      try {
        setIsCollapsedState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse sidebar state", e);
      }
    }
  }, []);

  const setIsCollapsed = (value: boolean) => {
    setIsCollapsedState(value);
    localStorage.setItem("sidebar_collapsed", JSON.stringify(value));
  };

  const contextValue = React.useMemo(
    () => ({
      isSidebarOpen,
      setIsSidebarOpen,
      isCollapsed,
      setIsCollapsed,
    }),
    [isSidebarOpen, isCollapsed]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
};
