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
      <div className="container">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!hall) {
    return (
      <div className="container">
        <div className="error-message">Зал не найден</div>
      </div>
    );
  }

  return (
    <div className="hall-detail-page">
      <div className="container">
        <div className="hall-detail-header">
          <h1 className="hall-detail-title">{hall.name}</h1>
          
          {isAuthenticated ? (
            <Link to={`/booking/${hall.id}`} className="button booking-button">
              Забронировать
            </Link>
          ) : (
            <Link to="/login" className="button booking-button">
              Войдите для бронирования
            </Link>
          )}
        </div>
        
        <div className="hall-detail-content">
          <div className="hall-detail-main">
            <div className="hall-detail-image-container">
              {hall.image ? (
                <img 
                  src={hall.image} 
                  alt={hall.name} 
                  className="hall-detail-image" 
                />
              ) : (
                <div className="hall-detail-placeholder">Нет изображения</div>
              )}
            </div>
            
            <div className="hall-detail-info">
              <div className="info-section">
                <h2 className="info-title">Информация о зале</h2>
                <p className="hall-address">
                  <span className="info-label">Адрес:</span> {hall.address}
                </p>
                <p className="hall-capacity">
                  <span className="info-label">Вместимость:</span> {hall.capacity} человек
                </p>
                <p className="hall-price">
                  <span className="info-label">Стоимость:</span> {hall.price_per_hour} ₽/час
                </p>
              </div>
              
              <div className="info-section">
                <h2 className="info-title">Описание</h2>
                <p className="hall-description">{hall.description}</p>
              </div>
            </div>
          </div>
          
          <div className="hall-detail-sidebar">
            {services.length > 0 && (
              <div className="services-section sidebar-section">
                <h2 className="sidebar-title">Дополнительные услуги</h2>
                <ul className="services-list">
                  {services.map((service) => (
                    <li key={service.id} className="service-item">
                      <div className="service-header">
                        <h3 className="service-name">{service.name}</h3>
                        <span className="service-price">{service.price} ₽</span>
                      </div>
                      <p className="service-description">{service.description}</p>
                      <p className="service-duration">
                        <span className="info-label">Длительность:</span> {service.duration} мин.
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {schedule.length > 0 && (
              <div className="schedule-section sidebar-section">
                <h2 className="sidebar-title">Расписание работы</h2>
                <ul className="schedule-list">
                  {schedule.map((item) => (
                    <li key={item.id} className="schedule-item">
                      <span className="schedule-day">{getDayName(item.day_of_week)}</span>
                      <span className="schedule-time">
                        {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HallDetailPage;