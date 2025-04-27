// src/components/Sidebar.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Функция для определения активного состояния ссылки
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <div className={`sidebar-backdrop ${isOpen ? 'show' : ''}`} onClick={toggleSidebar}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo" onClick={() => isOpen && toggleSidebar()}>
            <div className="logo-icon">SH</div>
            <span className="logo-text">Sport<span className="logo-accent">Hub</span></span>
          </Link>
          <button className="sidebar-close" onClick={toggleSidebar}>
            <span className="close-icon">×</span>
          </button>
        </div>

        <div className="sidebar-content">
          <nav className="sidebar-nav">
            <ul className="nav-list">
              <li className="nav-item">
                <Link 
                  to="/" 
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                  onClick={() => isOpen && toggleSidebar()}
                >
                  <span className="nav-icon">🏠</span>
                  <span className="nav-text">Главная</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/halls" 
                  className={`nav-link ${isActive('/halls') ? 'active' : ''}`}
                  onClick={() => isOpen && toggleSidebar()}
                >
                  <span className="nav-icon">🏟️</span>
                  <span className="nav-text">Залы</span>
                </Link>
              </li>
              
              {user ? (
                <>
                  <li className="nav-item">
                    <Link 
                      to="/profile" 
                      className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                      onClick={() => isOpen && toggleSidebar()}
                    >
                      <span className="nav-icon">👤</span>
                      <span className="nav-text">Личный кабинет</span>
                    </Link>
                  </li>
                  {user.user_type === 'admin' && (
                    <li className="nav-item">
                      <Link 
                        to="/admin" 
                        className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                        onClick={() => isOpen && toggleSidebar()}
                      >
                        <span className="nav-icon">⚙️</span>
                        <span className="nav-text">Панель администратора</span>
                      </Link>
                    </li>
                  )}
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link 
                      to="/login" 
                      className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                      onClick={() => isOpen && toggleSidebar()}
                    >
                      <span className="nav-icon">🔑</span>
                      <span className="nav-text">Войти</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                      to="/register" 
                      className={`nav-link ${isActive('/register') ? 'active' : ''}`}
                      onClick={() => isOpen && toggleSidebar()}
                    >
                      <span className="nav-icon">✏️</span>
                      <span className="nav-text">Регистрация</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {user && (
            <div className="sidebar-footer">
              <div className="user-info-mini">
                <div className="user-avatar">{user.first_name ? user.first_name[0] : user.email[0]}</div>
                <div className="user-details">
                  <div className="user-name">{user.first_name} {user.last_name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              </div>
              <button className="logout-button" onClick={handleLogout}>
                <span className="logout-icon">🚪</span>
                <span className="logout-text">Выйти</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;