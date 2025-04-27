import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HallsPage from './pages/HallsPage';
import HallDetailPage from './pages/HallDetailPage';
import BookingPage from './pages/BookingPage';
import ProfilePage from './pages/ProfilePage';
import AdminPanel from './pages/AdminPanel';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './services/AuthContext';
import './styles/App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Закрывать сайдбар при переходе на новый маршрут
  const closeSidebar = () => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  // Следить за шириной экрана для определения мобильной версии
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth >= 992) {
        setSidebarOpen(false); // На больших экранах сайдбар всегда виден
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          
          <div className="main-wrapper">
            {isMobile && (
              <MobileHeader toggleSidebar={toggleSidebar} />
            )}
            
            <main className="main-content" onClick={closeSidebar}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/halls" element={<HallsPage />} />
                <Route path="/halls/:id" element={<HallDetailPage />} />
                <Route path="/booking/:hallId" element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminPanel />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;