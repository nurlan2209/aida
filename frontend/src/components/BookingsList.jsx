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
    return <p className="no-bookings">У вас пока нет бронирований</p>;
  }

  return (
    <div className="bookings-list">
      {sortedBookings.map((booking) => (
        <div key={booking.id} className="booking-item card">
          <div 
            className="booking-header"
            onClick={() => toggleBookingDetails(booking.id)}
          >
            <div className="booking-main-info">
              <h3 className="booking-title">{booking.sport_hall.name}</h3>
              <p className="booking-date">{formatDate(booking.date)}</p>
              <p className="booking-time">
                {booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}
              </p>
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
          
          {expandedBooking === booking.id && (
            <div className="booking-details">
              <div className="booking-details-row">
                <span className="booking-detail-label">Зал:</span>
                <span className="booking-detail-value">{booking.sport_hall.name}</span>
              </div>

              <div className="booking-details-row">
                <span className="booking-detail-label">Адрес:</span>
                <span className="booking-detail-value">{booking.sport_hall.address}</span>
              </div>
              
              {booking.service && (
                <div className="booking-details-row">
                  <span className="booking-detail-label">Услуга:</span>
                  <span className="booking-detail-value">{booking.service.name}</span>
                </div>
              )}
              
              <div className="booking-details-row">
                <span className="booking-detail-label">Статус оплаты:</span>
                <span className="booking-detail-value">
                  {booking.payment ? 'Оплачено' : 'Не оплачено'}
                </span>
              </div>
              
              <div className="booking-actions">
                {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                  <button 
                    className="button button-outline cancel-button"
                    onClick={() => onCancelBooking(booking.id)}
                  >
                    Отменить бронирование
                  </button>
                )}
                
                {booking.status === 'pending' && (
                  <button 
                    className="button payment-button"
                    onClick={() => handlePaymentClick(booking)}
                  >
                    Оплатить
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