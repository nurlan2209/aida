import { useState } from 'react';
import '../styles/BookingsList.css';
import PaymentModal from './PaymentModal';

const BookingsList = ({ bookings = [], onCancelBooking, onPaymentComplete }) => {
  // Убедитесь, что bookings всегда массив
  const bookingsArray = Array.isArray(bookings) ? bookings : [];
  
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [paymentBooking, setPaymentBooking] = useState(null);

  const toggleBookingDetails = (bookingId) => {
    if (expandedBooking === bookingId) {
      setExpandedBooking(null);
    } else {
      setExpandedBooking(bookingId);
    }
  };

  const handlePaymentClick = (booking) => {
    setPaymentBooking(booking);
  };

  const handlePaymentModalClose = (paymentSuccess) => {
    if (paymentSuccess && onPaymentComplete) {
      // Вызываем колбэк для обновления статуса бронирования
      onPaymentComplete(paymentBooking.id);
    }
    setPaymentBooking(null);
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Подтверждено';
      case 'pending':
        return 'Ожидает оплаты';
      case 'cancelled':
        return 'Отменено';
      case 'completed':
        return 'Завершено';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  // Сортировка бронирований по дате (от новых к старым)
  const sortedBookings = [...bookingsArray].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  if (bookingsArray.length === 0) {
    return (
      <div className="no-bookings">
        <div className="no-bookings-icon">🔍</div>
        <h3 className="no-bookings-title">У вас пока нет бронирований</h3>
        <p className="no-bookings-text">Найдите и забронируйте спортивный зал, чтобы он появился здесь</p>
      </div>
    );
  }

  return (
    <div className="bookings-list">
      {sortedBookings.map((booking) => (
        <div key={booking.id} className="booking-card">
          <div 
            className="booking-header"
            onClick={() => toggleBookingDetails(booking.id)}
          >
            <div className="booking-hall-info">
              <div className="booking-hall-icon">🏟️</div>
              <div className="booking-hall-details">
                <h3 className="booking-hall-name">{booking.sport_hall.name}</h3>
                <p className="booking-address">{booking.sport_hall.address}</p>
              </div>
            </div>
            
            <div className="booking-meta">
              <div className="booking-date-time">
                <div className="booking-date">{formatDate(booking.date)}</div>
                <div className="booking-time">
                  {booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}
                </div>
              </div>
              
              <div className="booking-status-container">
                <span className={`booking-status ${getStatusClass(booking.status)}`}>
                  {getStatusLabel(booking.status)}
                </span>
                <span className="booking-toggle">
                  {expandedBooking === booking.id ? '▲' : '▼'}
                </span>
              </div>
            </div>
          </div>
          
          {expandedBooking === booking.id && (
            <div className="booking-details">
              <div className="booking-details-grid">
                <div className="details-section">
                  <h4 className="details-title">Информация о бронировании</h4>
                  <div className="detail-row">
                    <span className="detail-label">Номер:</span>
                    <span className="detail-value">#{booking.id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Дата:</span>
                    <span className="detail-value">{formatDate(booking.date)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Время:</span>
                    <span className="detail-value">{booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Статус:</span>
                    <span className={`detail-value status-text ${getStatusClass(booking.status)}`}>
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>
                </div>
                
                <div className="details-section">
                  <h4 className="details-title">Спортивный зал</h4>
                  <div className="detail-row">
                    <span className="detail-label">Название:</span>
                    <span className="detail-value">{booking.sport_hall.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Адрес:</span>
                    <span className="detail-value">{booking.sport_hall.address}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Вместимость:</span>
                    <span className="detail-value">{booking.sport_hall.capacity} чел.</span>
                  </div>
                </div>
              </div>
              
              {booking.service && (
                <div className="service-section">
                  <h4 className="details-title">Дополнительные услуги</h4>
                  <div className="service-item">
                    <div className="service-name">{booking.service.name}</div>
                    <div className="service-price">{booking.service.price} ₸</div>
                  </div>
                  <div className="service-description">{booking.service.description}</div>
                </div>
              )}
              
              <div className="booking-actions">
                {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                  <button 
                    className="button button-outline cancel-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Предотвращаем всплытие события
                      onCancelBooking(booking.id);
                    }}
                  >
                    Отменить бронирование
                  </button>
                )}
                
                {booking.status === 'pending' && (
                  <button 
                    className="button payment-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Предотвращаем всплытие события
                      handlePaymentClick(booking);
                    }}
                  >
                    Оплатить сейчас
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

        {paymentBooking && (
        <PaymentModal 
          booking={paymentBooking} 
          onClose={handlePaymentModalClose} 
        />
      )}
    </div>
  );
};

export default BookingsList;