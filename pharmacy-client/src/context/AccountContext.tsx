import React, { createContext, useContext, useState, useEffect } from "react";
import agent from "../api/agent";
import { useNavigate } from "react-router-dom";

interface User {
  displayName: string;
  email: string;
  token: string;
  role: string; // أضفنا الـ Role هنا
  image?: string;
  phoneNumber?: string;
}

interface AccountContextType {
  user: User | null;
  login: (values: any) => Promise<void>;
  register: (values: any) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  updateLocalUser: (updatedFields: Partial<User>) => void;
  updateUser: (updatedFields: Partial<User>) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // التأكد من وجود مستخدم مسجل عند فتح الموقع
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as Partial<User>;
        // Guard against malformed localStorage payloads to avoid app crash.
        if (parsedUser?.token && parsedUser?.email) {
          setUser({
            displayName: parsedUser.displayName ?? "",
            email: parsedUser.email,
            token: parsedUser.token,
            role: parsedUser.role ?? "Customer",
            image: parsedUser.image,
            phoneNumber: parsedUser.phoneNumber,
          });
        } else {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Invalid user payload in localStorage:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = async (values: any) => {
    try {
      const userData = await agent.Account.login(values);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token);
      setUser(userData);
      navigate("/shop");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (values: any) => {
    try {
      const userData = await agent.Account.register(values);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token);
      setUser(userData);
      navigate("/shop");
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("basket_id");
    setUser(null);
    navigate("/login");
  };

  const updateLocalUser = (updatedFields: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const newUser = { ...prev, ...updatedFields };
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  };

  const updateUser = (updatedFields: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const newUser = { ...prev, ...updatedFields };
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  };

  const isAdmin = user?.role === "Admin";

  return (
    <AccountContext.Provider value={{ user, login, register, logout, isAdmin, updateLocalUser, updateUser }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) throw new Error("useAccount must be used within an AccountProvider");
  return context;
};
