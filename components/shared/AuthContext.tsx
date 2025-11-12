'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 模拟一个简单的 User 类型，移除 Firebase 依赖
type User = {
  uid: string;
};

interface AuthContextType {
  user: User | null;
  nickname: string | null;
  isLoading: boolean;
  login: (name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // 模拟从本地存储恢复登录状态
      const storedNickname = localStorage.getItem('userNickname'); // 检查本地存储
      if (storedNickname) { // 如果有昵称，则自动登录
        const mockUser = { uid: `mock-user-${storedNickname}` } as User;
        setUser(mockUser);
        setNickname(storedNickname);
      } else {
        // 如果没有，则确保用户状态为空
        setUser(null);
        setNickname(null);
      }
    } catch (error) {
      console.error("Error while restoring auth state:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (name: string) => {
    // --- 模拟登录 ---
    // 移除真实的 Firebase 匿名登录网络请求，避免因网络或配置问题导致失败。
    // 创建一个模拟的用户对象，确保总能成功“登录”。
    const mockUser = { uid: `mock-user-${Date.now()}` } as User;

    localStorage.setItem('userNickname', name);
    setNickname(name);
    setUser(mockUser); // 使用模拟用户对象直接更新状态
  };

  const logout = () => {
    // 清除本地存储和状态
    localStorage.removeItem('userNickname');
    setNickname(null);
    setUser(null);
  };

  const value = { user, nickname, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}