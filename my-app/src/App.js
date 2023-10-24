import Header from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {Provider} from "react-redux"
import Photos from './components/Photos';
import About from './components/About';
import Main from './components/Main';
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
      </BrowserRouter>
  );
}

export default App;
