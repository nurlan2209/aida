import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PaymentModal.css';

const calculateAmount = (booking) => {
    // Если есть прямое указание суммы, используем его
    if (booking.amount) return booking.amount;
    
    // Иначе рассчитываем на основе стоимости зала и времени
    let amount = 0;
    
    // Стоимость зала за час
    const hourlyRate = booking.sport_hall?.price_per_hour || 0;
    
    // Вычисляем количество часов
    if (booking.start_time && booking.end_time) {
      const [startHour, startMinute] = booking.start_time.split(':').map(Number);
      const [endHour, endMinute] = booking.end_time.split(':').map(Number);
      
      // Расчет разницы в часах
      const startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;
      const durationInHours = (endTimeInMinutes - startTimeInMinutes) / 60;
      
      amount = hourlyRate * durationInHours;
    }
    
    // Добавляем стоимость услуги, если она выбрана
    if (booking.service && booking.service.price) {
      amount += Number(booking.service.price);
    }
    
    return amount.toFixed(2); // Округляем до двух десятичных знаков
  }

const PaymentModal = ({ booking, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(20);
  const navigate = useNavigate();

  useEffect(() => {
    // Таймер обратного отсчета
    if (timeLeft <= 0) {
      // Имитация успешной оплаты
      handleSuccessfulPayment();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleSuccessfulPayment = () => {
    // Здесь можно добавить логику фактического обновления статуса
    onClose(true); // true означает, что оплата успешна
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <button className="close-button" onClick={() => onClose(false)}>×</button>
        
        <h2 className="payment-modal-title">Оплата бронирования</h2>
        
        <div className="payment-info">
        <p>Номер бронирования: {booking.id}</p>
        <p>Зал: {booking.sport_hall?.name}</p>
        <p>Дата: {new Date(booking.date).toLocaleDateString('ru-RU')}</p>
        <p>Время: {booking.start_time} - {booking.end_time}</p>
        <p>Сумма к оплате: {calculateAmount(booking)} ₽</p>
        </div>
        
        <div className="qr-code-container">
          <img 
            src="/images/payment-qr.png" 
            alt="QR-код для оплаты" 
            className="payment-qr-code"
          />
          <p className="qr-instruction">Отсканируйте QR-код для оплаты</p>
        </div>
        
        <div className="payment-timer">
          <p>Автоматическое подтверждение через: <span className="timer-count">{timeLeft}</span> сек</p>
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${(timeLeft / 20) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="payment-footer">
          <p className="payment-note">
            Внимание: Это демонстрационный режим оплаты. 
            Фактическое списание средств не производится.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;