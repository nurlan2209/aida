import { Link } from 'react-router-dom';
import '../styles/HallCard.css';

const HallCard = ({ hall }) => {
  return (
    <div className="hall-card card">
      <div className="hall-card-image-container">
        {hall.image ? (
          <img 
            src={hall.image} 
            alt={hall.name} 
            className="hall-card-image"
          />
        ) : (
          <div className="hall-card-placeholder">
            <span className="hall-icon">🏟️</span>
          </div>
        )}
        <div className="hall-card-price-tag">
          <span>{hall.price_per_hour} ₸/час</span>
        </div>
      </div>
      
      <div className="hall-card-content">
        <h3 className="hall-card-title">{hall.name}</h3>
        
        <div className="hall-card-address">
          <span className="address-icon">📍</span>
          <span className="address-text">{hall.address}</span>
        </div>
        
        <div className="hall-card-capacity">
          <span className="capacity-icon">👥</span>
          <span className="capacity-text">Вместимость: {hall.capacity} чел.</span>
        </div>
        
        <div className="hall-card-description">
          {hall.description && hall.description.length > 120 
            ? `${hall.description.substring(0, 120)}...` 
            : hall.description}
        </div>
        
        <Link to={`/halls/${hall.id}`} className="hall-card-button">
          Подробнее
        </Link>
      </div>
    </div>
  );
};

export default HallCard;