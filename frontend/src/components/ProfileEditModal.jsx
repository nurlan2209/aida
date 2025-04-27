import { useState, useEffect } from 'react';
import { updateUserProfile } from '../services/api';
import '../styles/ProfileEditModal.css';

const ProfileEditModal = ({ user, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    username: ''
  });
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        username: user.username || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Удаляем null значения и пустые строки
      const dataToSubmit = Object.entries(formData)
        .reduce((acc, [key, value]) => {
          if (value !== null && value !== '') {
            acc[key] = value;
          }
          return acc;
        }, {});

      // Отправляем данные на сервер
      const updatedProfile = await updateUserProfile(dataToSubmit);
      
      // Уведомляем родительский компонент об успешном обновлении
      onUpdateSuccess(updatedProfile);
      onClose();
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
      
      // Обработка ошибки
      if (err.response && err.response.data) {
        // Если API вернул ошибки валидации
        if (typeof err.response.data === 'object') {
          const errorMessages = Object.entries(err.response.data)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors[0] : errors}`)
            .join('; ');
          setError(errorMessages);
        } else {
          setError(err.response.data.toString());
        }
      } else {
        setError('Произошла ошибка при обновлении профиля.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Редактирование профиля</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}
          
          <form className="profile-edit-form" onSubmit={handleSubmit}>
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
            
            <div className="form-group password-notice">
              <p>Для изменения пароля используйте отдельную форму в разделе безопасности</p>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="button button-outline cancel-button"
                onClick={onClose}
                disabled={loading}
              >
                Отмена
              </button>
              <button 
                type="submit" 
                className="button save-button"
                disabled={loading}
              >
                {loading ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;