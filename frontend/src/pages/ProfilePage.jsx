// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getUserBookings, cancelBooking, getUserSubscriptions } from '../services/api';
import { useAuth } from '../services/AuthContext';
import BookingsList from '../components/BookingsList';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  const [bookings, setBookings] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.bookingSuccess 
    ? 'Бронирование успешно создано!' 
    : null);

  const handlePaymentComplete = async (bookingId) => {
    try {
      // Обновляем локальное состояние, меняем статус бронирования на 'confirmed'
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'confirmed' } 
            : booking
        )
      );
      
      setSuccessMessage('Оплата прошла успешно! Бронирование подтверждено.');
      
      // Скрываем сообщение об успешной оплате через 5 секунд
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
    } catch (err) {
      console.error('Ошибка при обновлении статуса оплаты:', err);
      setError('Ошибка при обновлении статуса оплаты');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Загрузка бронирований пользователя
        const bookingsData = await getUserBookings();
        console.log('Полученные данные о бронированиях:', bookingsData);
        setBookings(bookingsData);
        
        // Загрузка абонементов пользователя
        const subscriptionsData = await getUserSubscriptions();
        setSubscriptions(subscriptionsData);
        
        setLoading(false);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Ошибка при загрузке данных');
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      // Отправляем запрос на отмену бронирования
      await cancelBooking(bookingId);
      
      // Обновляем состояние списка бронирований
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      ));
      
      setSuccessMessage('Бронирование успешно отменено');
      
      // Скрываем сообщение об успешной операции через 5 секунд
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
    } catch (err) {
      console.error('Ошибка при отмене бронирования:', err);
      setError('Ошибка при отмене бронирования');
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="page-title">Личный кабинет</h1>
        
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}
        
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        
        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="user-info card">
              <h2 className="user-info-title">Информация о пользователе</h2>
              <div className="user-info-details">
                <p>
                  <span className="user-info-label">Имя:</span> 
                  {user.first_name} {user.last_name}
                </p>
                <p>
                  <span className="user-info-label">Email:</span> 
                  {user.email}
                </p>
                {user.phone && (
                  <p>
                    <span className="user-info-label">Телефон:</span> 
                    {user.phone}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="profile-main">
            <div className="profile-tabs">
              <button 
                className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                Мои бронирования
              </button>
              <button 
                className={`tab-button ${activeTab === 'subscriptions' ? 'active' : ''}`}
                onClick={() => setActiveTab('subscriptions')}
              >
                Мои абонементы
              </button>
            </div>
            
            <div className="tab-content">
              {loading ? (
                <div className="loading">Загрузка...</div>
              ) : (
                <>
                    {activeTab === 'bookings' && (
                    <div className="bookings-tab">
                        <BookingsList 
                        bookings={bookings} 
                        onCancelBooking={handleCancelBooking}
                        onPaymentComplete={handlePaymentComplete} 
                        />
                    </div>
                    )}
                  
                  {activeTab === 'subscriptions' && (
                    <div className="subscriptions-tab">
                      {subscriptions.length === 0 ? (
                        <p className="no-subscriptions">У вас пока нет активных абонементов</p>
                      ) : (
                        <div className="user-subscriptions">
                          {subscriptions.map((subscription) => (
                            <div key={subscription.id} className="subscription-item card">
                              <h3 className="subscription-name">{subscription.subscription_name}</h3>
                              <div className="subscription-dates">
                                <p>
                                  <span className="subscription-info-label">Начало:</span> 
                                  {new Date(subscription.start_date).toLocaleDateString('ru-RU')}
                                </p>
                                <p>
                                  <span className="subscription-info-label">Окончание:</span> 
                                  {new Date(subscription.end_date).toLocaleDateString('ru-RU')}
                                </p>
                              </div>
                              {subscription.visits_left !== null && (
                                <p className="subscription-visits">
                                  <span className="subscription-info-label">Осталось посещений:</span> 
                                  {subscription.visits_left}
                                </p>
                              )}
                              <div className="subscription-status">
                                Статус: 
                                <span className={`status-badge ${subscription.is_active ? 'active' : 'inactive'}`}>
                                  {subscription.is_active ? 'Активен' : 'Неактивен'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;