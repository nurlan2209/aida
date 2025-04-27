import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHalls } from '../services/api';
import HallCard from '../components/HallCard';
import '../styles/HomePage.css';

const HomePage = () => {
  const [featuredHalls, setFeaturedHalls] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Получаем залы и выбираем первые 3 для отображения на главной
        const hallsData = await getHalls();
        setFeaturedHalls(hallsData.slice(0, 3));
        

        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Бронирование спортивных залов онлайн</h1>
            <p className="hero-description">
              Найдите и забронируйте спортивный зал для ваших тренировок и мероприятий
              в несколько кликов
            </p>
            <Link to="/halls" className="button hero-button">
              Найти спортзал
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section section">
        <div className="container">
          <h2 className="section-title">Наши преимущества</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3 className="feature-title">Быстрое бронирование</h3>
              <p className="feature-description">
                Бронируйте залы за несколько минут без лишних звонков и ожиданий
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3 className="feature-title">Удобный поиск</h3>
              <p className="feature-description">
                Выбирайте залы по расположению, оснащению и доступному времени
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-credit-card"></i>
              </div>
              <h3 className="feature-title">Онлайн-оплата</h3>
              <p className="feature-description">
                Оплачивайте бронирование онлайн и получайте моментальное подтверждение
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-user-friends"></i>
              </div>
              <h3 className="feature-title">Личный кабинет</h3>
              <p className="feature-description">
                Управляйте своими бронированиями и отслеживайте историю в личном кабинете
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="halls-section section">
        <div className="container">
          <h2 className="section-title">Популярные залы</h2>
          
          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : (
            <>
              <div className="halls-grid">
                {featuredHalls.map((hall) => (
                  <HallCard key={hall.id} hall={hall} />
                ))}
              </div>
              
              <div className="all-halls-link-container">
                <Link to="/halls" className="button button-outline all-halls-link">
                  Посмотреть все залы
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Готовы начать тренироваться?</h2>
            <p className="cta-description">
              Зарегистрируйтесь сейчас и получите доступ к бронированию спортивных залов
            </p>
            <Link to="/register" className="button cta-button">
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;