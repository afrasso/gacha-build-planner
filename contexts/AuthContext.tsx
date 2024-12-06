"use client";

import { usePathname } from "next/navigation";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

interface User {
  email: string;
  id: string;
}

interface AuthContextType {
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
  isAuthenticated: boolean;
  login: ({ email, password }: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  user: null | User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  apiUrl: string;
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ apiUrl, children }) => {
  const [user, setUser] = useState<null | User>(null);
  const [token, setToken] = useState<string | undefined>();
  const pathname = usePathname();

  const login = async ({ email, password }: { email: string; password: string }): Promise<boolean> => {
    try {
      const response = await fetch(`${apiUrl}/auth/tokens`, {
        body: JSON.stringify({ password, username: email }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const authToken = data.access_token;
      setToken(authToken);
      validateToken(authToken);
      localStorage.setItem("auth_token", authToken);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(undefined);
    localStorage.removeItem("auth_token");
  }, []);

  const validateToken = useCallback(
    async (authToken: string) => {
      try {
        const response = await fetch(`${apiUrl}/auth/tokens/validate`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          method: "GET",
        });

        if (response.ok) {
          const { user } = await response.json();
          setUser({ email: user.email, id: user.id });
          return true;
        } else {
          logout();
          return false;
        }
      } catch (error) {
        console.error("Error validating token:", error);
        logout();
        return false;
      }
    },
    [apiUrl, logout]
  );

  const authFetch = async (url: string, options: RequestInit = {}) => {
    if (!token) {
      throw new Error("No authentication token");
    }

    const authOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    return fetch(`${apiUrl}/api${url}`, authOptions);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      setToken(storedToken);
      validateToken(storedToken);
    }
  }, [pathname, validateToken]);

  return (
    <AuthContext.Provider value={{ authFetch, isAuthenticated: !!token, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
