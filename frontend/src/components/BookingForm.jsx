import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../services/AuthContext';
import { getHallById, getServicesByHall, createBooking } from '../services/api';
import '../styles/BookingForm.css';

registerLocale('ru', ru);

const BookingForm = ({ hallId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [hall, setHall] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    date: new Date(),
    startTime: '10:00',
    endTime: '11:00',
    serviceId: '',
  });
  
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const hallData = await getHallById(hallId);
        const servicesData = await getServicesByHall(hallId);
        
        setHall(hallData);
        setServices(servicesData);
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке данных');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [hallId]);

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        setSubmitting(true);
        setSubmitError(null);
        
        // Преобразование даты к формату YYYY-MM-DD
        const formattedDate = formData.date.toISOString().split('T')[0];
        
        const bookingData = {
          sport_hall: Number(hallId),
          service: formData.serviceId ? Number(formData.serviceId) : null,
          date: formattedDate,
          start_time: formData.startTime,
          end_time: formData.endTime,
          user: user.id  // Добавить ID пользователя
      };
          
          console.log('Отправляемые данные бронирования:', bookingData);
        
        await createBooking(bookingData);
        
        // Перенаправление на страницу профиля после успешного бронирования
        navigate('/profile', { state: { bookingSuccess: true } });
        
      } catch (err) {
        console.error('Ошибка бронирования:', err);
        console.error('Детали ошибки:', err.response?.data);
        
        let errorMessage = 'Ошибка при создании бронирования. ';
        if (err.response?.data) {
          // Если сервер вернул JSON с деталями ошибки
          if (typeof err.response.data === 'object') {
            // Преобразуем объект ошибок в строку
            errorMessage += Object.entries(err.response.data)
              .map(([field, errors]) => `${field}: ${errors}`)
              .join('; ');
          } else {
            // Если вернулась строка
            errorMessage += err.response.data;
          }
        }
        
        setSubmitError(errorMessage);
        setSubmitting(false);
      }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="booking-form-container">
      <h2 className="booking-form-title">Забронировать зал: {hall.name}</h2>
      
      {submitError && (
        <div className="alert alert-danger">{submitError}</div>
      )}
      
      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Дата</label>
          <DatePicker
            selected={formData.date}
            onChange={handleDateChange}
            dateFormat="dd.MM.yyyy"
            minDate={new Date()}
            locale="ru"
            className="form-input date-picker"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Время начала</label>
            <select
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
              <option value="18:00">18:00</option>
              <option value="19:00">19:00</option>
              <option value="20:00">20:00</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Время окончания</label>
            <select
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
              <option value="18:00">18:00</option>
              <option value="19:00">19:00</option>
              <option value="20:00">20:00</option>
              <option value="21:00">21:00</option>
            </select>
          </div>
        </div>
        
        {services.length > 0 && (
          <div className="form-group">
            <label className="form-label">Дополнительные услуги</label>
            <select
              name="serviceId"
              value={formData.serviceId}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Без дополнительных услуг</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - {service.price} ₽
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="booking-summary">
          <h3 className="booking-summary-title">Итого:</h3>
          <p className="booking-summary-price">
            Стоимость аренды: {hall.price_per_hour} ₽/час
          </p>
        </div>
        
        <button 
          type="submit" 
          className="button booking-submit-button"
          disabled={submitting}
        >
          {submitting ? 'Обработка...' : 'Забронировать'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;