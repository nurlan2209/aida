// src/components/MobileHeader.jsx
import { useAuth } from '../services/AuthContext';
import '../styles/MobileHeader.css';

const MobileHeader = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="mobile-header">
      <button className="menu-toggle" onClick={toggleSidebar}>
        <span className="hamburger-icon">
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </span>
      </button>
      <div className="mobile-logo">
        <span className="mobile-logo-text">Sport<span className="mobile-logo-accent">Booking</span></span>
      </div>
      {user && (
        <div className="mobile-user-avatar">
          {user.first_name ? user.first_name[0] : user.email[0]}
        </div>
      )}
    </header>
  );
};

export default MobileHeader;