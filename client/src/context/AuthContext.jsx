import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext({ user: null, loading: true, showSplash: true, isAuthenticated: false });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('ecosense_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Splash timeout
    const timer = setTimeout(() => {
      setShowSplash(false);
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setUser(res.data.user);
      localStorage.setItem('ecosense_user', JSON.stringify(res.data.user));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      // Automaticaly login after register
      setUser(res.data.user);
      localStorage.setItem('ecosense_user', JSON.stringify(res.data.user));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecosense_user');
  };

  const updateProfile = async (updatedData) => {
    if (!user?.id) return { success: false, error: 'Not authenticated' };
    try {
      const res = await axios.put(`/api/auth/profile/${user.id}`, updatedData);
      setUser(res.data.user);
      localStorage.setItem('ecosense_user', JSON.stringify(res.data.user));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Update failed' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading, showSplash, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return { user: null, loading: true, showSplash: true, isAuthenticated: false };
  }
  return context;
};
