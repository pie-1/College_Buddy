import { createContext, useContext, useState, useEffect } from 'react';
// Remove axios import if not using it
// import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // ✅ MOCK LOGIN - No backend needed
  const login = async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock user for testing
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: email,
      department: 'computer',
      year: '3',
      profileImage: null,
    };

    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);

    return { success: true };
  };

  // ✅ MOCK REGISTER - No backend needed
  const register = async (name, email, password, additionalData = {}) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser = {
      id: Date.now(),
      name: name,
      email: email,
      department: additionalData.department || 'common',
      year: additionalData.year || '1',
      profileImage: null,
    };

    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};