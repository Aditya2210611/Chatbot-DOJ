
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user on load
  useEffect(() => {
    const storedUser = localStorage.getItem('legalAIUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would be an API call
      if (email && password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = {
          id: `user-${Date.now()}`,
          email
        };
        
        localStorage.setItem('legalAIUser', JSON.stringify(user));
        setCurrentUser(user);
        toast.success("Successfully logged in");
        return;
      }
      throw new Error("Invalid email or password");
    } catch (error) {
      toast.error("Login failed: " + (error instanceof Error ? error.message : "Unknown error"));
      throw error;
    }
  };

  // Mock signup function
  const signup = async (email: string, password: string, name: string) => {
    try {
      // In a real app, this would be an API call
      if (email && password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = {
          id: `user-${Date.now()}`,
          email,
          name
        };
        
        localStorage.setItem('legalAIUser', JSON.stringify(user));
        setCurrentUser(user);
        toast.success("Account created successfully");
        return;
      }
      throw new Error("Invalid registration data");
    } catch (error) {
      toast.error("Registration failed: " + (error instanceof Error ? error.message : "Unknown error"));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('legalAIUser');
    setCurrentUser(null);
    toast.success("Logged out successfully");
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    isAuthenticated: !!currentUser,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
