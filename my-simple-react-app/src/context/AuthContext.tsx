import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of the AuthContext
interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
  login: (token: string, userId: string) => void;
  logout: () => void;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));

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
      console.log('Loaded userId from localStorage:', storedUserId); 
      setUserId(storedUserId);
    }
  }, []);

  // Login function to store token and userId
  const login = (newToken: string, newUserId: string) => {
    console.log('Saving userId:', newUserId);
  localStorage.setItem('token', newToken);
  localStorage.setItem('userId', newUserId);
    setToken(newToken);
    setUserId(newUserId);
  };

  // Logout function to clear token and userId
  const logout = () => {
    setToken(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        userId,
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