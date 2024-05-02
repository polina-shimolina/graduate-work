import Header from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Photos from './components/Photos';
import About from './components/About';
import Main from './components/Main';
import Footer from './components/Footer';
import Login from './components/LoginAndRegister';
import Logout from './components/Logout';
import Account from './components/Account';
function App() {
  
  return (
      <BrowserRouter basename="/">
        <Header/>
        <Routes>
          <Route path="/" element={<><h1>Сегментируйте свои изображения с удовольствием</h1><h3>1000000 пользователей уже воспользовались и оценили наш сервис</h3><Main /></>}/>
          <Route path="/about" element={<><About /></>}/>
          <Route path="/photos" element={<><Photos /></>}/>
          <Route path="/login" element={<><Login /></>}/>
          <Route path="/logout" element={<><Logout /></>}/>
          <Route path="/account" element={<><Account /></>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
  );
}

export default App;

