import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <Link to="/" className="footer-logo">
            <div className="footer-logo-icon">SH</div>
            <span className="footer-logo-text">Sport<span className="footer-logo-accent">Hub</span></span>
          </Link>
          <p className="footer-description">
            Удобная платформа для онлайн-бронирования спортивных залов. Тренируйтесь в любое удобное время!
          </p>
        </div>
        
        <div className="footer-links-container">
          <div className="footer-links-column">
            <h4 className="footer-heading">Разделы</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Главная</Link></li>
              <li><Link to="/halls" className="footer-link">Спортзалы</Link></li>
              <li><Link to="/profile" className="footer-link">Профиль</Link></li>
            </ul>
          </div>

          <div className="footer-links-column">
            <h4 className="footer-heading">Контакты</h4>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <span className="contact-icon">📞</span>
                <span>+7 (777) 425-95-77</span>
              </li>
              <li className="footer-contact-item">
                <span className="contact-icon">📧</span>
                <span>info@sporthub.ru</span>
              </li>
              <li className="footer-contact-item">
                <span className="contact-icon">📍</span>
                <span>г. Астана, ул. Мангилик Ел, 1</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p className="copyright">© {currentYear} SportHub. Все права защищены</p>
      </div>
    </footer>
  );
};

export default Footer;