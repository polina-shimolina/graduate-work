/* import Header from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {Provider} from "react-redux"
import Photos from './components/Photos';
import About from './components/About';
import Main from './components/Main';
import Footer from './components/Footer';
import { Login, Register } from './components/LoginAndRegister';
function App() {
  return (
      <BrowserRouter basename="/">
        <Header/>
        <Routes>
          <Route path="/" element={<><h1>Сегментируйте свои изображения с удовольствием</h1><h3>1000000 пользователей уже воспользовались и оценили наш сервис</h3><Main /></>}/>
          <Route path="/about" element={<><About /></>}/>
          <Route path="/photos" element={<><Photos /></>}/>
          <Route path="/login" element={<><Login /></>}/>
          <Route path="/register" element={<><Register /></>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
  );
}

export default App;
 */
import React, { useState, useEffect } from 'react';

const UserProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [dateJoined, setDateJoined] = useState('');
  const [error, setError] = useState();

  useEffect(() => {
    fetch('/api/user')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Something went wrong: code ${response.status}`);
        }
      })
      .then(({ data }) => {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setUsername(data.username);
        setEmail(data.email);
        setDateJoined(data.date_joined);
      })
      .catch(error => {
        console.log(error);
        setError('Ошибка, подробности в консоли');
      });
  }, []);

  return (
    <div className="App">
      {error ? (
        <p>{error}</p>
      ) : (
        <div className="Profile">
          <h1>{firstName} {lastName}</h1>
          <h2>{username}</h2>
          <p>email: {email}</p>
          <p>Профиль создан {dateJoined}</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
