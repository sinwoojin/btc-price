"use client";

import { BASE_URL } from "@/config/api";
import { useAuth, useUser } from "@/context/AuthUserProvider";
import { fetchClient } from "@/lib/api/fetchClient";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Portfolio {
  balance: number;
  holdings: {
    coinId: string;
    amount: number;
    averagePrice: number;
  }[];
}

interface WalletContextType {
  portfolio: Portfolio | null;
  refreshPortfolio: () => Promise<void>;
  loading: boolean;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user, isLoaded } = useUser();
  const { accessToken } = useAuth();

  const refreshPortfolio = useCallback(async () => {
    if (!isLoaded) {
      console.log("WalletProvider: user not loaded yet");
      return;
    }
    if (!user) {
      console.log("WalletProvider: no user");
      return;
    }
    if (!accessToken) {
      console.log("WalletProvider: no access token");
      return;
    }
    
    setLoading(true);
    try {
      console.log("Fetching portfolio for user:", user.email, "with token:", accessToken?.substring(0, 10) + "...");
      const response = await fetchClient("/wallet/portfolio");
      if (response.ok) {
        const data = await response.json();
        console.log("Portfolio fetched:", data);
        setPortfolio(data);
      } else {
        console.error("Failed to fetch portfolio:", response.status);
      }
    } catch (err) {
      console.error("Failed to fetch portfolio:", err);
    } finally {
      setLoading(false);
    }
  }, [user, isLoaded, accessToken]);

  useEffect(() => {
    if (!isLoaded) {
      console.log("WalletProvider: waiting for user load");
      return;
    }

    if (!user) {
      console.log("WalletProvider: no user, clearing portfolio");
      setPortfolio(null);
      return;
    }

    if (!accessToken) {
      console.log("WalletProvider: no access token, waiting...");
      return;
    }

    console.log("WalletProvider: initializing for user", user.email);
    
    refreshPortfolio();
    console.log("Connecting to WebSocket:", BASE_URL);
    const newSocket = io(BASE_URL);

    newSocket.on("connect", () => {
      console.log("WebSocket connected:", newSocket.id);
      // Join user-specific room
      newSocket.emit("joinUserRoom", user.email);
    });

    newSocket.on("walletUpdate", (data: { balance: number }) => {
      console.log("Received wallet update:", data);
      setPortfolio((prev) => {
        if (!prev) return prev;
        return { ...prev, balance: data.balance };
      });
    });

    newSocket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    setSocket(newSocket);

    return () => {
      console.log("Cleaning up WebSocket connection");
      newSocket.close();
    };
  }, [user, isLoaded, accessToken, refreshPortfolio]);

  const value = {
    portfolio,
    refreshPortfolio,
    loading,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
