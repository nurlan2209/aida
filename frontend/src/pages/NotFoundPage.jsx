import { Link } from 'react-router-dom';
import '../styles/NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Страница не найдена</h2>
          <p className="not-found-message">
            Страница, которую вы ищете, не существует или была перемещена.
          </p>
          <Link to="/" className="button not-found-button">
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;