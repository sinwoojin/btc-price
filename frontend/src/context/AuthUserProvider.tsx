"use client";

import React, { createContext, useContext, useLayoutEffect, useState } from "react";

interface User {
  email: string;
  name: string;
  profileImage: string;
  roomId: number;
  userId: number;
}

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  isLoaded: boolean;
}

// Context 생성
export const AuthContext = createContext<AuthContextType | null>(null);
export const UserContext = createContext<UserContextType | null>(null);

// 커스텀 훅 (선택 사항)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthUserProvider");
  }
  return context;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within an AuthUserProvider");
  }
  return context;
};

export function AuthUserProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<User | null>(null);

  useLayoutEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    
    if (storedToken) {
      setAccessTokenState(storedToken);
    }
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }
    
    setIsLoaded(true);
  }, []);

  const setAccessToken = (token: string) => {
    setAccessTokenState(token);
    localStorage.setItem("accessToken", token);
  };

  const clearAccessToken = () => {
    setAccessTokenState(null);
    localStorage.removeItem("accessToken");
  };

  const setUser = (user: User) => {
    setUserState(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const clearUser = () => {
    setUserState(null);
    localStorage.removeItem("user");
  };

  const authValue = {
    accessToken,
    setAccessToken,
    clearAccessToken,
  };
  
  const userValue = { 
    user, 
    setUser, 
    clearUser, 
    isLoaded 
  };

  return (
    <AuthContext.Provider value={authValue}>
      <UserContext.Provider value={userValue}>{children}</UserContext.Provider>
    </AuthContext.Provider>
  );
}
