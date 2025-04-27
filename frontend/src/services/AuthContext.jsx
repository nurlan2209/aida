import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { login as apiLogin, register as apiRegister, getUserProfile } from './api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Проверка срока действия токена
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {
          // Токен истек, удаляем его
          logout();
          setLoading(false);
          return;
        }

        // Получение профиля пользователя
        const userProfile = await getUserProfile();
        setUser(userProfile);
      } catch (error) {
        console.error('Ошибка аутентификации:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      localStorage.setItem('token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      
      const userProfile = await getUserProfile();
      setUser(userProfile);
      
      return userProfile;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await apiRegister(userData);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  // Новая функция для обновления данных пользователя в контексте
  const updateUserContext = (updatedUserData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedUserData
    }));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUserContext, // Добавляем новую функцию в контекст
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};