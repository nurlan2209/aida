import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHallById, getServicesByHall, getScheduleByHall } from '../services/api';
import { useAuth } from '../services/AuthContext';
import '../styles/HallDetailPage.css';

const HallDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  
  const [hall, setHall] = useState(null);
  const [services, setServices] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Функция для отображения дня недели на русском языке
  const getDayName = (day) => {
    const days = [
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота',
      'Воскресенье',
    ];
    return days[day];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Получаем информацию о зале
        const hallData = await getHallById(id);
        setHall(hallData);
        
        // Получаем услуги для этого зала
        const servicesData = await getServicesByHall(id);
        setServices(servicesData);
        
        // Получаем расписание для этого зала
        const scheduleData = await getScheduleByHall(id);
        setSchedule(scheduleData);
        
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке информации о зале');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!hall) {
    return (
      <div className="error-container">
        <div className="error-message">Зал не найден</div>
      </div>
    );
  }

  return (
    <div className="hall-detail-page">
      <div className="detail-header">
        <div className="hall-detail-name">
          <h1 className="page-title">{hall.name}</h1>
          <div className="hall-address">
            <span className="address-icon">📍</span>
            <span>{hall.address}</span>
          </div>
        </div>
        
        <div className="hall-actions">
          
          {isAuthenticated ? (
            <Link to={`/booking/${hall.id}`} className="booking-button button">
              Забронировать
            </Link>
          ) : (
            <Link to="/login" className="booking-button button">
              Войдите для бронирования
            </Link>
          )}
        </div>
      </div>
      
      <div className="hall-detail-content">
        <div className="hall-image-container">
          {hall.image ? (
            <img 
              src={hall.image} 
              alt={hall.name} 
              className="hall-image" 
            />
          ) : (
            <div className="hall-image-placeholder">
              <span className="hall-icon">🏟️</span>
            </div>
          )}
          
          <div className="hall-price-badge">
            <div className="price-value">{hall.price_per_hour} ₸</div>
            <div className="price-label">в час</div>
          </div>
        </div>
        
        <div className="hall-tabs">
          <button 
            className={`hall-tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <span className="tab-icon">ℹ️</span>
            <span>Информация</span>
          </button>
          
          <button 
            className={`hall-tab ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <span className="tab-icon">🛠️</span>
            <span>Услуги</span>
          </button>
          
          <button 
            className={`hall-tab ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <span className="tab-icon">📅</span>
            <span>Расписание</span>
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'info' && (
            <div className="info-tab">
              <div className="info-section">
                <h2 className="section-subtitle">О зале</h2>
                <div className="hall-description">
                  {hall.description}
                </div>
              </div>
              
              <div className="info-section">
                <h2 className="section-subtitle">Характеристики</h2>
                <div className="features-grid">
                  <div className="feature-item">
                    <div className="feature-icon">👥</div>
                    <div className="feature-details">
                      <div className="feature-value">{hall.capacity}</div>
                      <div className="feature-label">Вместимость</div>
                    </div>
                  </div>
                  
                  <div className="feature-item">
                    <div className="feature-icon">💰</div>
                    <div className="feature-details">
                      <div className="feature-value">{hall.price_per_hour} ₸</div>
                      <div className="feature-label">Цена в час</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'services' && (
            <div className="services-tab">
              {services.length > 0 ? (
                <div className="services-list">
                  {services.map((service) => (
                    <div key={service.id} className="service-card">
                      <div className="service-header">
                        <h3 className="service-name">{service.name}</h3>
                        <div className="service-price">{service.price} ₸</div>
                      </div>
                      <div className="service-description">{service.description}</div>
                      <div className="service-details">
                        <div className="service-detail-item">
                          <span className="detail-icon">⏱️</span>
                          <span className="detail-text">Длительность: {service.duration} мин.</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-services">
                  <div className="empty-icon">🔍</div>
                  <h3>Нет доступных услуг</h3>
                  <p>Для этого зала не предусмотрены дополнительные услуги</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'schedule' && (
            <div className="schedule-tab">
              {schedule.length > 0 ? (
                <div className="schedule-table">
                  <div className="schedule-header">
                    <div className="day-column">День недели</div>
                    <div className="time-column">Время работы</div>
                  </div>
                  {schedule.map((item) => (
                    <div key={item.id} className="schedule-row">
                      <div className="day-column">
                        <span className="day-icon">📆</span>
                        <span>{getDayName(item.day_of_week)}</span>
                      </div>
                      <div className="time-column">
                        <span className="time-range">
                          {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-schedule">
                  <div className="empty-icon">🕒</div>
                  <h3>Нет информации о расписании</h3>
                  <p>Расписание работы для этого зала не указано</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="booking-cta">
          <div className="cta-container">
            <div className="cta-content">
              <h3 className="cta-title">Готовы забронировать?</h3>
              <p className="cta-description">Выберите удобную дату и время для тренировки</p>
            </div>
            {isAuthenticated ? (
              <Link to={`/booking/${hall.id}`} className="button cta-button">
                Забронировать сейчас
              </Link>
            ) : (
              <Link to="/login" className="button cta-button">
                Войдите для бронирования
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HallDetailPage;