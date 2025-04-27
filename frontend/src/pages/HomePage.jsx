import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHalls } from '../services/api';
import HallCard from '../components/HallCard';
import '../styles/HomePage.css';

const HomePage = () => {
  const [featuredHalls, setFeaturedHalls] = useState([]);
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
        <div className="hero-content">
          <h1 className="hero-title">Современный подход к бронированию спортзалов</h1>
          <p className="hero-description">
            Найдите идеальное пространство для тренировок, организуйте командные игры или
            проведите спортивное мероприятие
          </p>
          <div className="hero-buttons">
            <Link to="/halls" className="button hero-button">
              Найти зал
            </Link>
            <Link to="/register" className="button button-outline hero-button-secondary">
              Регистрация
            </Link>
          </div>
        </div>
        <div className="hero-image-container">
          <div className="hero-image"></div>
        </div>
      </section>

      <section className="features-section section">
        <div className="container">
          <h2 className="section-title">Почему выбирают нас?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Быстрое бронирование</h3>
              <p className="feature-description">
                Забронируйте спортзал за 60 секунд — выбирайте время, оплачивайте онлайн и получайте моментальное подтверждение
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">Удобная навигация</h3>
              <p className="feature-description">
              Интуитивно понятный интерфейс поможет быстро найти нужный зал и оформить бронирование без лишних шагов
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3 className="feature-title">Безопасная оплата</h3>
              <p className="feature-description">
                Защищенные платежи, прозрачные цены без скрытых комиссий и возможность возврата средств
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👤</div>
              <h3 className="feature-title">Мгновенная регистрация</h3>
              <p className="feature-description">
              Создайте аккаунт за минуту и начните бронировать залы без лишних сложностей
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="popular-halls-section section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Популярные залы</h2>
            <Link to="/halls" className="section-link">Смотреть все <span className="arrow-icon">→</span></Link>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading"></div>
            </div>
          ) : (
            <div className="halls-grid">
              {featuredHalls.map((hall) => (
                <HallCard key={hall.id} hall={hall} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="how-it-works-section section">
        <div className="container">
          <h2 className="section-title">Как это работает</h2>
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <h3 className="step-title">Найдите зал</h3>
              <p className="step-description">
                Используйте фильтры для поиска подходящего зала в вашем районе
              </p>
            </div>
            
            <div className="step-item">
              <div className="step-number">2</div>
              <h3 className="step-title">Выберите время</h3>
              <p className="step-description">
                Проверьте доступность и выберите удобный для вас день и время
              </p>
            </div>
            
            <div className="step-item">
              <div className="step-number">3</div>
              <h3 className="step-title">Оплатите онлайн</h3>
              <p className="step-description">
                Безопасно оплатите бронирование с помощью удобного способа оплаты
              </p>
            </div>
            
            <div className="step-item">
              <div className="step-number">4</div>
              <h3 className="step-title">Приходите заниматься</h3>
              <p className="step-description">
                И посетите в забронированное время
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Начните заниматься спортом сегодня</h2>
            <p className="cta-description">
              Зарегистрируйтесь сейчас и получите доступ к бронированию лучших спортивных залов города
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="button cta-button">
                Создать аккаунт
              </Link>
              <Link to="/halls" className="button button-outline cta-button-secondary">
                Посмотреть залы
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;