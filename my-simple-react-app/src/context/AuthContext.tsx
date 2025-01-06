import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of the AuthContext
interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
  firstName: string | null;
  login: (token: string, userId: string) => void;
  logout: () => void;
}

interface DecodedToken {
  firstName: string;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));
  const [firstName, setFirstName] = useState<string | null>(null);

  // Effect to synchronize token and userId with localStorage
  //useEffect(() => {
  //if (token) {
  //localStorage.setItem('token', token);
  // } else {
  //localStorage.removeItem('token');
  // }

  //if (userId) {
  // localStorage.setItem('userId', userId);
  //} else {
  // localStorage.removeItem('userId');
  //}
  //}, [token, userId]);
  // Load userId from localStorage when the app initializes
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setFirstName(decoded.firstName || null);
      } catch (error) {
        console.error('Invalid token', error);
        setFirstName(null);
      }
    } else {
      setFirstName(null);
    }
  }, [token]);

  // Login function to store token and userId
  const login = (newToken: string, newUserId: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userId', newUserId);
    setToken(newToken);
    setUserId(newUserId);
  };

  // Logout function to clear token and userId
  const logout = () => {
    setToken(null);
    setUserId(null);
    setFirstName(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        userId,
        firstName,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
