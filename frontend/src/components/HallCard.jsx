import { Link } from 'react-router-dom';
import '../styles/HallCard.css';

const HallCard = ({ hall }) => {
  return (
    <div className="hall-card card">
      <div className="hall-card-image">
        {hall.image ? (
          <img src={hall.image} alt={hall.name} />
        ) : (
          <div className="hall-card-placeholder">Нет изображения</div>
        )}
      </div>
      <div className="hall-card-content">
        <h3 className="hall-card-title">{hall.name}</h3>
        <p className="hall-card-address">{hall.address}</p>
        <p className="hall-card-price">от {hall.price_per_hour} ₽/час</p>
        <Link to={`/halls/${hall.id}`} className="button hall-card-button">
          Подробнее
        </Link>
      </div>
    </div>
  );
};

export default HallCard;