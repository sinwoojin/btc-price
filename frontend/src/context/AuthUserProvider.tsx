"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  email: string;
  nickname: string;
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
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // 로컬 스토리지에서 상태 불러오기
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setAccessToken(storedToken);
    }
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 상태 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }
  }, [accessToken]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const authValue = {
    accessToken,
    setAccessToken,
    clearAccessToken: () => setAccessToken(null),
  };
  const userValue = { user, setUser, clearUser: () => setUser(null) };

  return (
    <AuthContext.Provider value={authValue}>
      <UserContext.Provider value={userValue}>{children}</UserContext.Provider>
    </AuthContext.Provider>
  );
}
