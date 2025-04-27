import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getUserBookings, cancelBooking } from '../services/api';
import { useAuth } from '../services/AuthContext';
import BookingsList from '../components/BookingsList';
import ProfileEditModal from '../components/ProfileEditModal';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { user, updateUserContext } = useAuth();
  const location = useLocation();
  
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.bookingSuccess 
    ? 'Бронирование успешно создано!' 
    : null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
        setBookings(bookingsData);
        
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

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleProfileUpdate = (updatedUser) => {
    // Обновляем контекст пользователя
    updateUserContext(updatedUser);
    
    // Показываем сообщение об успешном обновлении
    setSuccessMessage('Профиль успешно обновлен');
    
    // Скрываем сообщение через 5 секунд
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1 className="page-title">Личный кабинет</h1>
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}
        
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
      </div>
      
      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="user-profile-card">
            <div className="user-avatar-large">
              {user.first_name ? user.first_name[0] : user.email[0]}
            </div>
            <div className="user-info">
              <h2 className="user-name">
                {user.first_name} {user.last_name}
              </h2>
              <p className="user-email">{user.email}</p>
              {user.phone && (
                <p className="user-phone">{user.phone}</p>
              )}
            </div>
            <div className="user-type">
              <span className="user-type-badge">
                {user.user_type === 'admin' ? 'Администратор' : 'Клиент'}
              </span>
            </div>
            <div className="profile-actions">
              <button 
                className="edit-profile-button"
                onClick={handleOpenEditModal}
              >
                <span className="button-icon">✏️</span>
                Редактировать профиль
              </button>
            </div>
          </div>
          
          <div className="stats-card">
            <h3 className="stats-title">Ваша статистика</h3>
            <div className="stats-item">
              <div className="stat-icon">📅</div>
              <div className="stat-details">
                <div className="stat-value">{bookings.length}</div>
                <div className="stat-label">Всего бронирований</div>
              </div>
            </div>
            <div className="stats-item">
              <div className="stat-icon">✅</div>
              <div className="stat-details">
                <div className="stat-value">
                  {bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length}
                </div>
                <div className="stat-label">Подтвержденных</div>
              </div>
            </div>
            <div className="stats-item">
              <div className="stat-icon">⏳</div>
              <div className="stat-details">
                <div className="stat-value">
                  {bookings.filter(b => b.status === 'pending').length}
                </div>
                <div className="stat-label">Ожидают оплаты</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="profile-main">
          <div className="profile-tabs">
            <button 
              className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <span className="tab-icon">📋</span>
              Мои бронирования
            </button>
          </div>
          
          <div className="tab-content">
            {loading ? (
              <div className="loading-container">
                <div className="loading"></div>
              </div>
            ) : (
              <>
                {activeTab === 'bookings' && (
                  <div className="bookings-tab">
                    <BookingsList 
                      bookings={bookings.filter(b => b.status !== 'completed')} 
                      onCancelBooking={handleCancelBooking}
                      onPaymentComplete={handlePaymentComplete} 
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {isEditModalOpen && (
        <ProfileEditModal 
          user={user}
          onClose={handleCloseEditModal}
          onUpdateSuccess={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default ProfilePage;