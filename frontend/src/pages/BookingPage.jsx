import { useParams } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import '../styles/BookingPage.css';

const BookingPage = () => {
  const { hallId } = useParams();

  return (
    <div className="booking-page">
      <div className="container">
        <h1 className="page-title">Бронирование</h1>
        <BookingForm hallId={hallId} />
      </div>
    </div>
  );
};

export default BookingPage;