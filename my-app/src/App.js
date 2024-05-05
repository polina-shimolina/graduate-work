import Header from './components/Header';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Photos from './components/Photos';
import About from './components/About';
import Main from './components/Main';
import Footer from './components/Footer';
import Login from './components/LoginForm';
import Logout from './components/Logout';
import Account from './components/Account';
import Register from './components/RegistrationForm'
import Team from './components/Team'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // eslint-disable-next-line
  const [hasTeam, setHasTeam] = useState(true); // Заглушка для hasTeam


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

  const handleRegister = () => {
    console.log('Пользователь успешно зарегистрирован');
    window.location.href = '/login';
    };

  return (
      <BrowserRouter basename="/">
        <Header />
        <Routes>
          <Route path="/" element={<><h1>Сегментируйте свои изображения с удовольствием</h1><h3>1000000 пользователей уже воспользовались и оценили наш сервис</h3><Main /></>}/>
          <Route path="/about" element={<><About /></>}/>
          <Route path="/photos" element={<><Photos /></>}/>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleRegister}/>} />
          <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
          <Route path="/profile" element={<Account isAuthenticated={isAuthenticated} />} />
          <Route path="/team" element={<Team isAuthenticated={isAuthenticated}/>} />
        </Routes>
        <Footer/>
      </BrowserRouter>
  );
}

export default App;

