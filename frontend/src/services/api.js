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

// Функция для обработки данных бронирования
const processBookings = (bookings) => {
  return bookings.map(booking => {
    const result = {...booking};
    
    // Если есть sport_hall_details, но sport_hall это просто ID или объект без нужных полей
    if (result.sport_hall_details) {
      result.sport_hall = result.sport_hall_details;
      delete result.sport_hall_details;
    }
    
    // Обработка данных услуги
    if (result.service_details) {
      result.service = result.service_details;
      delete result.service_details;
    }
    
    return result;
  });
};

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
    const response = await api.get('/bookings/bookings/');
    console.log('API ответ с бронированиями:', response.data);
    
    let bookingsData;
    
    // Если ответ - это объект с полем 'results', берем results
    if (response.data && Array.isArray(response.data.results)) {
      bookingsData = response.data.results;
    }
    // Если ответ сам является массивом, используем его
    else if (Array.isArray(response.data)) {
      bookingsData = response.data;
    }
    // В крайнем случае возвращаем пустой массив
    else {
      bookingsData = [];
    }
    
    // Обрабатываем данные, чтобы sport_hall и service содержали полную информацию
    return processBookings(bookingsData);
  } catch (error) {
    console.error('Ошибка при получении бронирований:', error);
    throw error.response?.data || { detail: 'Ошибка при получении бронирований' };
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings/bookings/', bookingData);
    
    // Обрабатываем полученные данные перед возвратом
    if (response.data) {
      return processBookings([response.data])[0];
    }
    
    return response.data;
  } catch (error) {
    console.error('Полная ошибка при создании бронирования:', error);
    if (error.response) {
      console.error('Статус ответа:', error.response.status);
      console.error('Данные ответа:', error.response.data);
    }
    throw error.response?.data || { detail: 'Ошибка при создании бронирования' };
  }
};

export const cancelBooking = async (id) => {
  try {
    const response = await api.post(`/bookings/bookings/${id}/cancel/`);
    
    // Обрабатываем данные перед возвратом
    if (response.data) {
      return processBookings([response.data])[0];
    }
    
    return response.data;
  } catch (error) {
    console.error('Ошибка при отмене бронирования:', error);
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

export const updateUserProfile = async (userData) => {
  try {
    // Здесь мы должны отправить PATCH запрос на эндпоинт редактирования профиля
    const response = await api.patch('/users/me/', userData);
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    throw error.response?.data || { detail: 'Ошибка при обновлении профиля' };
  }
};