import Header from './components/Header';
import React, { useState, useEffect } from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Photos from './components/Photos';
import About from './components/About';
import Main from './components/Main';
import Footer from './components/Footer';
import Login from './components/LoginAndRegister';
import Logout from './components/Logout';
import Account from './components/Account';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    console.log('Пользователь успешно вошел и isAuthenticated установлен в true');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login'; // Перенаправление на страницу входа
    setIsAuthenticated(false);
  };

  return (
      <BrowserRouter basename="/">
        <Header isAuthenticated={isAuthenticated} />
        <Routes>
          <Route path="/" element={<><h1>Сегментируйте свои изображения с удовольствием</h1><h3>1000000 пользователей уже воспользовались и оценили наш сервис</h3><Main /></>}/>
          <Route path="/about" element={<><About /></>}/>
          <Route path="/photos" element={<><Photos /></>}/>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
          <Route path="/account" element={<Account isAuthenticated={isAuthenticated} />} />
        </Routes>
        <Footer/>
      </BrowserRouter>
  );
}

export default App;

