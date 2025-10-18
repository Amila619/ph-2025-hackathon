import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AxiosInstance } from '../services/Axios.service';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));
  const [role, setRole] = useState('user');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Sync login state with localStorage changes (e.g., other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      const hasToken = !!localStorage.getItem('accessToken');
      setIsLoggedIn(hasToken);
      if (!hasToken) {
        setUser(null);
        setRole('user');
        setInitialized(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Refresh logged-in user data
  const refreshMe = async () => {
    if (!localStorage.getItem('accessToken')) {
      setIsLoggedIn(false);
      setUser(null);
      setRole('user');
      return null;
    }

    try {
      setLoading(true);
      const res = await AxiosInstance.get('/users/me');
      setUser(res.data);
      setRole(res.data?.role || 'user');
      setIsLoggedIn(true);

      if (!sessionStorage.getItem('welcomed')) {
        toast.success(`Welcome ${res.data?.universityMail || ''}`);
        sessionStorage.setItem('welcomed', '1');
      }

      return res.data;
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        console.warn('Request timeout - keeping user logged in');
        return null;
      }
      if (err.response?.status === 401 || err.response?.status === 403) {
        setIsLoggedIn(false);
        setUser(null);
        setRole('user');
        localStorage.removeItem('accessToken');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Initialize user info once when logged in
  useEffect(() => {
    if (!initialized && isLoggedIn) {
      setInitialized(true);
      refreshMe();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, initialized]);

  const value = useMemo(
    () => ({
      isLoggedIn,
      role,
      user,
      loading,
      setIsLoggedIn,
      setRole,
      setUser,
      refreshMe,
    }),
    [isLoggedIn, role, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
