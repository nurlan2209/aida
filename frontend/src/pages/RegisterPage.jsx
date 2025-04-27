import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import '../styles/AuthPages.css';

const RegisterPage = () => {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверка на совпадение паролей
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    try {
      setError(null);
      setLoading(true);
      
      // Создаем данные для отправки на сервер
      const userData = {
        email: formData.email,
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
        phone: formData.phone,
        user_type: 'client',  // По умолчанию регистрируем клиентов
      };
      
      // Регистрация пользователя
      await register(userData);
      
      // После успешной регистрации выполняем вход
      await login(formData.email, formData.password);
      
      // Перенаправление на главную страницу
      navigate('/');
      
    } catch (err) {
      // Обработка ошибок от сервера
      if (typeof err === 'object') {
        // Если ошибка является объектом с полями (например, ошибки валидации)
        const firstError = Object.entries(err)[0];
        if (firstError) {
          const [field, messages] = firstError;
          setError(`${field}: ${Array.isArray(messages) ? messages[0] : messages}`);
        } else {
          setError('Произошла ошибка при регистрации');
        }
      } else {
        setError(err.detail || 'Произошла ошибка при регистрации');
      }
      
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card card">
          <h1 className="auth-title">Регистрация</h1>
          
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name" className="form-label">Имя</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="last_name" className="form-label">Фамилия</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="username" className="form-label">Имя пользователя</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone" className="form-label">Телефон</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="+7 (___) ___-__-__"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required
                minLength="8"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Подтвердите пароль</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                required
                minLength="8"
              />
            </div>
            
            <button 
              type="submit" 
              className="button auth-submit-button"
              disabled={loading}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
          
          <div className="auth-links">
            <p className="auth-link-text">
              Уже есть аккаунт? <Link to="/login" className="auth-link">Войти</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;