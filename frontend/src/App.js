import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import VideoUpload from './VideoUpload';
import VideoList from './VideoList';
import './App.css';

function Navigation() {
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');

  const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '52px', fontWeight: '900', letterSpacing: '-2px', fontFamily: 'Inter, sans-serif' }}>
        YADRO
      </Link>
      <div className="nav-links">
        <Link to="/">Главная</Link>
        <Link to="/upload">Загрузить видео</Link>
        
        {/* Условный рендеринг: если есть токен - иконки, если нет - текст */}
        {token ? (
            <div className="user-controls">
                <div className="icon-wrapper user-icon" title="Профиль">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
                <button onClick={handleLogout} className="icon-wrapper logout-btn" title="Выйти">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                </button>
            </div>
        ) : (
            <>
                <Link to="/login">Вход</Link>
                <Link to="/register">Регистрация</Link>
            </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div>
        <Navigation />
        <div className="container">
          <Routes>
            <Route path="/" element={<VideoList />} />
            <Route path="/upload" element={<VideoUpload />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;