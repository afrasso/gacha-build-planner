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
  user: undefined | User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  apiUrl: string;
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ apiUrl, children }) => {
  const [token, setToken] = useState<string | undefined>();
  const [user, setUser] = useState<undefined | User>();
  const pathname = usePathname();

  const login = async ({ email, password }: { email: string; password: string }): Promise<boolean> => {
    try {
      const response = await fetch(`${apiUrl}/auth/tokens`, {
        body: JSON.stringify({ password, username: email }),
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "1",
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const responseBody = await response.json();
      localStorage.setItem("token", responseBody.access_token);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = useCallback(() => {
    setUser(undefined);
    setToken(undefined);
    localStorage.removeItem("token");
  }, []);

  const validateToken = useCallback(
    async (authToken: string) => {
      try {
        const response = await fetch(`${apiUrl}/auth/tokens/validate`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "ngrok-skip-browser-warning": "1",
          },
          method: "GET",
        });

        if (response.ok) {
          const responseBody = await response.json();
          setToken(authToken);
          setUser(responseBody.user);
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
        "ngrok-skip-browser-warning": "1",
      },
    };

    return fetch(`${apiUrl}/api${url}`, authOptions);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
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
