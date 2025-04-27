import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import '../styles/AuthPages.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Если пользователь был перенаправлен с другой страницы, сохраняем путь для перенаправления после входа
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError(null);
      setLoading(true);
      
      await login(formData.email, formData.password);
      
      // Перенаправление пользователя назад на страницу, с которой он пришел,
      // или на главную страницу, если он перешел на страницу входа напрямую
      navigate(from, { replace: true });
      
    } catch (err) {
      setError(err.detail || 'Произошла ошибка при входе. Пожалуйста, проверьте свои данные.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card card">
          <h1 className="auth-title">Вход в систему</h1>
          
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}
          
          <form className="auth-form" onSubmit={handleSubmit}>
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
              <label htmlFor="password" className="form-label">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="button auth-submit-button"
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
          
          <div className="auth-links">
            <p className="auth-link-text">
              Нет аккаунта? <Link to="/register" className="auth-link">Зарегистрироваться</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;