import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-info">
          <Link to="/" className="footer-logo">
            <span className="logo-text">Sport<span className="logo-accent">Booking</span></span>
          </Link>
          <p className="footer-description">
            Система онлайн-бронирования спортивных залов для ваших тренировок и мероприятий
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-links-column">
            <h4 className="footer-links-title">Навигация</h4>
            <ul className="footer-link-list">
              <li><Link to="/" className="footer-link">Главная</Link></li>
              <li><Link to="/halls" className="footer-link">Залы</Link></li>
              <li><Link to="/profile" className="footer-link">Личный кабинет</Link></li>
            </ul>
          </div>

          <div className="footer-links-column">
            <h4 className="footer-links-title">Информация</h4>
            <ul className="footer-link-list">
              <li><Link to="/about" className="footer-link">О нас</Link></li>
              <li><Link to="/terms" className="footer-link">Правила</Link></li>
              <li><Link to="/privacy" className="footer-link">Конфиденциальность</Link></li>
            </ul>
          </div>

          <div className="footer-links-column">
            <h4 className="footer-links-title">Контакты</h4>
            <ul className="footer-link-list contact-list">
              <li className="contact-item">Телефон: +7 (999) 123-45-67</li>
              <li className="contact-item">E-mail: info@sportbooking.ru</li>
              <li className="contact-item">Адрес: г. Москва, ул. Спортивная, 1</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p className="copyright">© {currentYear} SportBooking. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;