import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "../types";
import { authService } from "../services/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userId: string, password: string) => Promise<User>;
  signup: (
    userId: string,
    password: string,
    name: string,
    userType: "DOCTOR" | "PATIENT"
  ) => Promise<User>;
  logout: () => void;
}

interface JwtPayload {
  id: string;
  userId: string;
  name: string;
  userType: "DOCTOR" | "PATIENT";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to decode token and set user
  const processToken = (token: string): User => {
    console.log("in processToken");

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      console.log(decoded);
      const userData: User = {
        id: decoded.id,
        userId: decoded.userId,
        name: decoded.name,
        userType: decoded.userType,
      };

      console.log(userData);
      setUser(userData);
      return userData;
    } catch (ex) {
      console.log(ex);
      return {
        id: "",
        userId: "",
        name: "",
        userType: "PATIENT",
      };
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        processToken(token);
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (userId: string, password: string): Promise<User> => {
    const token = await authService.login({ userId, password });
    localStorage.setItem("token", token);
    return processToken(token);
  };

  const signup = async (
    userId: string,
    password: string,
    name: string,
    userType: "DOCTOR" | "PATIENT"
  ): Promise<User> => {
    const { token } = await authService.signup({
      userId,
      password,
      name,
      userType,
    });
    localStorage.setItem("token", token);
    const user = processToken(token);
    console.log(user);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
