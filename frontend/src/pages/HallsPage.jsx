import { useState, useEffect } from 'react';
import { getHalls } from '../services/api';
import HallCard from '../components/HallCard';
import '../styles/HallsPage.css';

const HallsPage = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        setLoading(true);
        const data = await getHalls();
        setHalls(data);
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке спортивных залов');
        setLoading(false);
      }
    };

    fetchHalls();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Фильтрация залов по поисковому запросу
  const filteredHalls = halls.filter((hall) =>
    hall.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hall.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="halls-page">
      <div className="container">
        <h1 className="page-title">Спортивные залы</h1>
        
        <div className="search-container">
          <input
            type="text"
            className="search-input form-input"
            placeholder="Поиск по названию или адресу"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        {loading ? (
          <div className="loading">Загрузка...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            {filteredHalls.length === 0 ? (
              <div className="no-results">
                <p>По вашему запросу ничего не найдено.</p>
              </div>
            ) : (
              <div className="halls-grid">
                {filteredHalls.map((hall) => (
                  <HallCard key={hall.id} hall={hall} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HallsPage;