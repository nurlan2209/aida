import { useState, useEffect } from 'react';
import { getHalls, getUserBookings } from '../services/api';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('halls');
  const [halls, setHalls] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Загружаем залы
        const hallsData = await getHalls();
        setHalls(hallsData);
        
        // Загружаем все бронирования (для админа)
        const bookingsData = await getUserBookings();
        setBookings(bookingsData);
        
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке данных');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  return (
    <div className="admin-panel">
      <div className="container">
        <h1 className="page-title">Панель администратора</h1>
        
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        
        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeTab === 'halls' ? 'active' : ''}`}
            onClick={() => setActiveTab('halls')}
          >
            Спортивные залы
          </button>
          <button 
            className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Бронирования
          </button>
          <button 
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Пользователи
          </button>
        </div>
        
        <div className="admin-content">
          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : (
            <>
              {activeTab === 'halls' && (
                <div className="halls-tab">
                  <div className="action-bar">
                    <button className="button">Добавить зал</button>
                  </div>
                  
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Название</th>
                          <th>Адрес</th>
                          <th>Вместимость</th>
                          <th>Цена (₸/час)</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {halls.map((hall) => (
                          <tr key={hall.id}>
                            <td>{hall.id}</td>
                            <td>{hall.name}</td>
                            <td>{hall.address}</td>
                            <td>{hall.capacity}</td>
                            <td>{hall.price_per_hour}</td>
                            <td className="actions-cell">
                              <button className="action-button edit">Изменить</button>
                              <button className="action-button delete">Удалить</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {activeTab === 'bookings' && (
                <div className="bookings-tab">
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Пользователь</th>
                          <th>Зал</th>
                          <th>Дата</th>
                          <th>Время</th>
                          <th>Статус</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking.id}>
                            <td>{booking.id}</td>
                            <td>{booking.user.email}</td>
                            <td>{booking.sport_hall.name}</td>
                            <td>{formatDate(booking.date)}</td>
                            <td>{booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}</td>
                            <td>
                              <span className={`status-badge status-${booking.status}`}>
                                {booking.status === 'confirmed' && 'Подтверждено'}
                                {booking.status === 'pending' && 'Ожидает оплаты'}
                                {booking.status === 'cancelled' && 'Отменено'}
                                {booking.status === 'completed' && 'Завершено'}
                              </span>
                            </td>
                            <td className="actions-cell">
                              <button className="action-button view">Просмотр</button>
                              {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                                <button className="action-button cancel">Отменить</button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {activeTab === 'users' && (
                <div className="users-tab">
                  <p className="tab-placeholder">Управление пользователями будет доступно в следующей версии.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;