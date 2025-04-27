import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Создание экземпляра axios с базовым URL
const api = axios.create({
  baseURL: API_URL,
});

// Добавление перехватчика для добавления токена к запросам
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Функции для работы с API
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/token/`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Ошибка при входе в систему' };
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Ошибка при регистрации' };
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/me/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Ошибка при получении профиля' };
  }
};

// Спортивные залы
export const getHalls = async () => {
  try {
    const response = await api.get('/bookings/halls/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Ошибка при получении списка залов' };
  }
};

export const getHallById = async (id) => {
  try {
    const response = await api.get(`/bookings/halls/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Ошибка при получении информации о зале' };
  }
};

// Услуги
export const getServicesByHall = async (hallId) => {
  try {
    const response = await api.get(`/bookings/services/?hall_id=${hallId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Ошибка при получении услуг' };
  }
};

// Расписание
export const getScheduleByHall = async (hallId) => {
  try {
    const response = await api.get(`/bookings/schedules/?hall_id=${hallId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Ошибка при получении расписания' };
  }
};

// Бронирования
export const getUserBookings = async () => {
  try {
    const response = await api.get('/bookings/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Ошибка при получении бронирований' };
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings/', bookingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Ошибка при создании бронирования' };
  }
};

export const cancelBooking = async (id) => {
  try {
    const response = await api.post(`/bookings/${id}/cancel/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Ошибка при отмене бронирования' };
  }
};

// Платежи
export const createPayment = async (paymentData) => {
  try {
    const response = await api.post('/payments/transactions/', paymentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Ошибка при создании платежа' };
  }
};

export const getSubscriptions = async () => {
  try {
    const response = await api.get('/payments/subscriptions/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Ошибка при получении списка абонементов' };
  }
};

export const getUserSubscriptions = async () => {
  try {
    const response = await api.get('/payments/user-subscriptions/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Ошибка при получении абонементов пользователя' };
  }
};