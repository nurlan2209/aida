import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import '../styles/Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <span className="logo-text">Sport<span className="logo-accent">Booking</span></span>
        </Link>

        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          <span className={`burger-icon ${mobileMenuOpen ? 'open' : ''}`}></span>
        </button>

        <nav className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Главная</Link>
            </li>
            <li className="nav-item">
              <Link to="/halls" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Залы</Link>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                    Личный кабинет
                  </Link>
                </li>
                {user.user_type === 'admin' && (
                  <li className="nav-item">
                    <Link to="/admin" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                      Панель администратора
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <button className="nav-link logout-button" onClick={handleLogout}>
                    Выйти
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                    Войти
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="button nav-button" onClick={() => setMobileMenuOpen(false)}>
                    Регистрация
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;